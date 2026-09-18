import { getSupabaseClient } from './auth.ts';
import { DeviceInfo, FileTransferItem, SessionData } from '../types.ts';
import { RealtimeChannel } from '@supabase/supabase-js';

export const QUICKDROP_SQL_SCHEMA = `
-- ==========================================
-- QuickDrop Supabase Database & Storage Setup
-- ==========================================

-- 1. Create quickdrop_sessions table
create table if not exists public.quickdrop_sessions (
  session_id text primary key,
  host_device jsonb,
  peer_device jsonb,
  status text default 'waiting',
  expires_at bigint,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create quickdrop_transfers table
create table if not exists public.quickdrop_transfers (
  id text primary key,
  session_id text references public.quickdrop_sessions(session_id) on delete cascade,
  name text not null,
  size bigint not null,
  type text,
  status text default 'pending',
  transfer_method text default 'webrtc_p2p',
  storage_path text,
  sha256 text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- 3. Enable realtime broadcasting on tables (if replica identity desired)
alter publication supabase_realtime add table public.quickdrop_sessions;
alter publication supabase_realtime add table public.quickdrop_transfers;

-- 4. Enable RLS (allow public access for demo/pairing)
alter table public.quickdrop_sessions enable row level security;
alter table public.quickdrop_transfers enable row level security;

create policy if not exists "Allow all access to sessions" 
on public.quickdrop_sessions for all using (true) with check (true);

create policy if not exists "Allow all access to transfers" 
on public.quickdrop_transfers for all using (true) with check (true);

-- 5. Create storage bucket for transfer fallbacks
insert into storage.buckets (id, name, public)
values ('quickdrop-transfers', 'quickdrop-transfers', true)
on conflict (id) do update set public = true;
`;

export class SupabaseService {
  private static activeChannels = new Map<string, RealtimeChannel>();

  /**
   * Subscribe to a Supabase Realtime Channel for ultra-low-latency signaling
   */
  public static subscribeToSignalingChannel(
    safeTopic: string,
    onMessage: (payload: any) => void
  ): RealtimeChannel | null {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    try {
      // Clean up previous channel if any
      const channelName = `quickdrop:${safeTopic}`;
      if (this.activeChannels.has(channelName)) {
        try {
          const old = this.activeChannels.get(channelName);
          old?.unsubscribe();
        } catch {}
      }

      const channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: false },
        },
      });

      channel
        .on('broadcast', { event: 'signal' }, (event) => {
          if (event && event.payload) {
            onMessage(event.payload);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`[Supabase Realtime] Connected to channel: ${channelName}`);
          }
        });

      this.activeChannels.set(channelName, channel);
      return channel;
    } catch (err) {
      console.warn('[Supabase Realtime] Subscribe failed:', err);
      return null;
    }
  }

  /**
   * Broadcast a signaling message through the Supabase Realtime Channel
   */
  public static async broadcastSignal(safeTopic: string, payload: any): Promise<boolean> {
    const channelName = `quickdrop:${safeTopic}`;
    const channel = this.activeChannels.get(channelName);
    if (!channel) return false;

    try {
      await channel.send({
        type: 'broadcast',
        event: 'signal',
        payload,
      });
      return true;
    } catch (err) {
      console.warn('[Supabase Realtime] Broadcast failed:', err);
      return false;
    }
  }

  /**
   * Unsubscribe from signaling channel
   */
  public static unsubscribeSignalingChannel(safeTopic: string): void {
    const channelName = `quickdrop:${safeTopic}`;
    const channel = this.activeChannels.get(channelName);
    if (channel) {
      try {
        channel.unsubscribe();
      } catch {}
      this.activeChannels.delete(channelName);
    }
  }

  /**
   * Record session in Supabase Database (graceful try/catch fallback)
   */
  public static async recordSession(session: SessionData, hostDeviceInfo?: DeviceInfo): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase
        .from('quickdrop_sessions')
        .upsert(
          {
            session_id: session.sessionId,
            host_device: hostDeviceInfo || null,
            status: 'waiting',
            expires_at: session.expiresAt,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'session_id' }
        );
    } catch (err) {
      // Table may not exist yet in user's project - graceful fallback
      console.debug('[Supabase DB] Session record skipped:', err);
    }
  }

  /**
   * Update session peer device and state in Supabase Database
   */
  public static async updateSessionPeer(
    sessionId: string,
    peerDeviceInfo: DeviceInfo,
    status: 'connected' | 'completed' | 'expired' = 'connected'
  ): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase
        .from('quickdrop_sessions')
        .update({
          peer_device: peerDeviceInfo,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);
    } catch (err) {
      console.debug('[Supabase DB] Session peer update skipped:', err);
    }
  }

  /**
   * Record transfer in Supabase Database
   */
  public static async recordTransfer(
    item: FileTransferItem,
    sessionId: string,
    method: 'webrtc_p2p' | 'supabase_storage' = 'webrtc_p2p',
    storagePath?: string
  ): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      await supabase
        .from('quickdrop_transfers')
        .upsert(
          {
            id: item.id,
            session_id: sessionId,
            name: item.name,
            size: item.size,
            type: item.type,
            status: item.state,
            transfer_method: method,
            storage_path: storagePath || null,
            sha256: item.sha256 || null,
            completed_at: item.state === 'completed' ? new Date().toISOString() : null,
          },
          { onConflict: 'id' }
        );
    } catch (err) {
      console.debug('[Supabase DB] Transfer record skipped:', err);
    }
  }

  /**
   * Upload file to Supabase Storage as a cloud fallback when P2P is blocked
   */
  public static async uploadToStorageFallback(
    file: File,
    sessionId: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'سحابة Supabase غير مربوطة. يرجى ربط مشروع Supabase لتفعيل الرفع السحابي الاحتياطي.' };
    }

    try {
      const bucket = 'quickdrop-transfers';
      const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${sessionId}/${Date.now()}_${cleanName}`;

      onProgress?.(25);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        // Try creating bucket if not exists
        if (error.message.includes('not found') || error.message.includes('bucket')) {
          try {
            await supabase.storage.createBucket(bucket, { public: true });
            const retry = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
            if (retry.error) return { success: false, error: retry.error.message };
          } catch {
            return { success: false, error: error.message };
          }
        } else {
          return { success: false, error: error.message };
        }
      }

      onProgress?.(80);

      // Get public URL
      const { data: pubData } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const publicUrl = pubData?.publicUrl || '';

      onProgress?.(100);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'فشل الرفع إلى Supabase Storage',
      };
    }
  }
}
