/**
 * QuickDrop Authentication Service
 * Supports both real Supabase Auth (when credentials are provided via VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
 * and a robust offline/preview fallback with full verification code & profile support.
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile } from '../types.ts';

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : '') || '';
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : '') || '';

  let localUrl = '';
  let localKey = '';
  try {
    if (typeof localStorage !== 'undefined') {
      localUrl = localStorage.getItem('quickdrop_supabase_url') || '';
      localKey = localStorage.getItem('quickdrop_supabase_anon_key') || '';
    }
  } catch {}

  const url = (envUrl || localUrl).trim();
  const anonKey = (envKey || localKey).trim();

  const isConfigured = Boolean(
    url && 
    anonKey && 
    !url.includes('your-project') &&
    !anonKey.includes('your-anon-key')
  );

  return { url, anonKey, isConfigured };
}

export function checkIsSupabaseConfigured(): boolean {
  return getSupabaseCredentials().isConfigured;
}

export function saveSupabaseConfig(url: string, anonKey: string): boolean {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('quickdrop_supabase_url', url.trim());
      localStorage.setItem('quickdrop_supabase_anon_key', anonKey.trim());
      supabaseInstance = null;
      return true;
    }
  } catch {}
  return false;
}

export function clearSupabaseConfig(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('quickdrop_supabase_url');
      localStorage.removeItem('quickdrop_supabase_anon_key');
      supabaseInstance = null;
    }
  } catch {}
}

export const isSupabaseConfigured = checkIsSupabaseConfigured();

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();
  if (!isConfigured) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

// Local storage keys for persistent authentication and profile sessions
const STORAGE_LOCAL_USERS = 'quickdrop_users_store';
const STORAGE_CURRENT_USER = 'quickdrop_current_user_session';
const STORAGE_PENDING_VERIFICATION = 'quickdrop_pending_verifications';

interface StoredLocalUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatarUrl?: string;
  deviceName?: string;
  emailConfirmed: boolean;
  createdAt: string;
}

interface PendingVerification {
  email: string;
  code: string;
  expiresAt: number;
}

function getStoredUsers(): StoredLocalUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredLocalUser[]) {
  localStorage.setItem(STORAGE_LOCAL_USERS, JSON.stringify(users));
}

function getPendingVerifications(): PendingVerification[] {
  try {
    const raw = localStorage.getItem(STORAGE_PENDING_VERIFICATION);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePendingVerifications(items: PendingVerification[]) {
  localStorage.setItem(STORAGE_PENDING_VERIFICATION, JSON.stringify(items));
}

// Helper to dispatch email to the backend mailer
async function dispatchVerificationEmail(email: string, code: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    await fetch('/api/auth/send-verification-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
  } catch (err) {
    console.warn('Could not dispatch verification email to server:', err);
  }
}

// For unit test verification only (never exposed to client UI)
export function _getPendingCodeForTestingOnly(email: string): string | null {
  const pending = getPendingVerifications();
  const entry = pending.find((p) => p.email === email.trim().toLowerCase());
  return entry?.code || null;
}

// Transform Supabase user to UserProfile
function mapSupabaseUser(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url || '',
    deviceName: user.user_metadata?.device_name || '',
    createdAt: user.created_at,
    emailConfirmed: Boolean(user.email_confirmed_at),
    provider: user.app_metadata?.provider === 'google' ? 'google' : 'email',
  };
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: UserProfile;
  needsEmailVerification?: boolean;
}

/**
 * Sign up a new user with Email and Password
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();

  // If real Supabase configured:
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim() || normalizedEmail.split('@')[0],
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          needsEmailVerification: true,
          user: mapSupabaseUser(data.user),
        };
      }

      if (data.user) {
        return {
          success: true,
          user: mapSupabaseUser(data.user),
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Supabase signup failed' };
    }
  }

  // Local persistent fallback mode
  const users = getStoredUsers();
  const existing = users.find((u) => u.email === normalizedEmail);

  if (existing && existing.emailConfirmed) {
    return { success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' };
  }

  // Generate 6-digit confirmation code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Update or insert unverified user
  const newUser: StoredLocalUser = {
    id: existing ? existing.id : 'user_' + Math.random().toString(36).substring(2, 11),
    email: normalizedEmail,
    passwordHash: btoa(password), // Simple base64 for local browser storage
    name: fullName.trim() || normalizedEmail.split('@')[0],
    avatarUrl: existing?.avatarUrl || '',
    deviceName: existing?.deviceName || '',
    emailConfirmed: false,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const updatedUsers = users.filter((u) => u.email !== normalizedEmail);
  updatedUsers.push(newUser);
  saveStoredUsers(updatedUsers);

  // Store pending verification
  const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
  pending.push({
    email: normalizedEmail,
    code,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  });
  savePendingVerifications(pending);

  // Dispatch code securely to user's email (never exposed in client UI)
  await dispatchVerificationEmail(normalizedEmail, code);

  return {
    success: true,
    needsEmailVerification: true,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt,
      emailConfirmed: false,
    },
  };
}

/**
 * Verify OTP / Confirmation Code
 */
export async function verifyEmailCode(
  email: string,
  code: string
): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  // If real Supabase configured:
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: cleanCode,
        type: 'signup',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = mapSupabaseUser(data.user);
        return { success: true, user: profile };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed' };
    }
  }

  // Local persistent fallback mode
  const pending = getPendingVerifications();
  const entry = pending.find((p) => p.email === normalizedEmail);

  if (!entry) {
    return { success: false, error: 'لم يتم العثور على طلب تأكيد لهذا البريد أو انتهت صلاحيته' };
  }

  if (Date.now() > entry.expiresAt) {
    return { success: false, error: 'انتهت صلاحية رمز التأكيد. يرجى طلب رمز جديد' };
  }

  if (entry.code !== cleanCode) {
    return { success: false, error: 'رمز التأكيد غير صحيح. يرجى مراجعة بريدك الإلكتروني بدقة' };
  }

  // Mark user as confirmed
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);
  if (!user) {
    return { success: false, error: 'المستخدم غير موجود' };
  }

  user.emailConfirmed = true;
  saveStoredUsers(users);

  // Clear pending
  savePendingVerifications(pending.filter((p) => p.email !== normalizedEmail));

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    deviceName: user.deviceName,
    createdAt: user.createdAt,
    emailConfirmed: true,
  };

  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));

  return { success: true, user: profile };
}

/**
 * Resend confirmation code exclusively to the user's email
 */
export async function resendVerificationCode(email: string): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  const newCode = Math.floor(100000 + Math.random() * 900000).toString();
  const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
  pending.push({
    email: normalizedEmail,
    code: newCode,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
  savePendingVerifications(pending);

  // Dispatch code securely to user's email
  await dispatchVerificationEmail(normalizedEmail, newCode);

  return {
    success: true,
  };
}

/**
 * Sign in user with email & password
 */
export async function signInUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const normalizedEmail = email.trim().toLowerCase();

  // If real Supabase configured:
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = mapSupabaseUser(data.user);
        return { success: true, user: profile };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign in failed' };
    }
  }

  // Local persistent fallback mode
  const users = getStoredUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    return { success: false, error: 'البريد الإلكتروني غير مسجل' };
  }

  if (user.passwordHash !== btoa(password)) {
    return { success: false, error: 'كلمة المرور غير صحيحة' };
  }

  if (!user.emailConfirmed) {
    // Generate new code and prompt for verification
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const pending = getPendingVerifications().filter((p) => p.email !== normalizedEmail);
    pending.push({
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });
    savePendingVerifications(pending);

    // Dispatch code securely to user's email
    await dispatchVerificationEmail(normalizedEmail, code);

    return {
      success: false,
      needsEmailVerification: true,
      error: 'يرجى تأكيد بريدك الإلكتروني أولاً عبر رمز التحقق الذي تم إرساله إلى بريدك',
    };
  }

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    deviceName: user.deviceName,
    createdAt: user.createdAt,
    emailConfirmed: true,
  };

  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
  return { success: true, user: profile };
}

/**
 * Load Google Identity Services (GSI) official script dynamically
 */
export async function loadGoogleIdentityScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if ((window as any).google?.accounts?.oauth2) return true;

  return new Promise((resolve) => {
    const existing = document.getElementById('google-gsi-client-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Sign in or sign up with Google OAuth
 */
export async function signInWithGoogle(googleProfile?: {
  email: string;
  name: string;
  avatarUrl?: string;
}): Promise<AuthResponse> {
  // If a profile was returned by an authenticated flow or test
  if (googleProfile) {
    const email = googleProfile.email.trim().toLowerCase();
    const name = googleProfile.name.trim() || email.split('@')[0];
    const avatarUrl = googleProfile.avatarUrl || '';

    const users = getStoredUsers();
    let user = users.find((u) => u.email === email);

    if (!user) {
      user = {
        id: 'goog_' + Math.random().toString(36).substring(2, 11),
        email,
        passwordHash: '',
        name,
        avatarUrl,
        deviceName: '',
        emailConfirmed: true, // Google accounts are verified by Google
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      saveStoredUsers(users);
    } else {
      user.emailConfirmed = true;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      saveStoredUsers(users);
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      deviceName: user.deviceName,
      createdAt: user.createdAt,
      emailConfirmed: true,
      provider: 'google',
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(profile));
    }

    return { success: true, user: profile };
  }

  // 1. If Supabase is configured:
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google OAuth failed' };
    }
  }

  // 2. If Google Client ID is configured via environment:
  const googleClientId = typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)
    : undefined;

  if (googleClientId && googleClientId.trim()) {
    const loaded = await loadGoogleIdentityScript();
    const google = typeof window !== 'undefined' ? (window as any).google : undefined;

    if (!loaded || !google?.accounts?.oauth2) {
      return {
        success: false,
        error: 'تعذر الاتصال بخدمة Google Identity. يرجى التحقق من اتصال الإنترنت وحظر الإعلانات.',
      };
    }

    return new Promise<AuthResponse>((resolve) => {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: googleClientId.trim(),
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              resolve({
                success: false,
                error: 'خطأ في المصادقة من Google: ' + tokenResponse.error,
              });
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                if (!res.ok) {
                  resolve({
                    success: false,
                    error: 'فشل استرداد بيانات المستخدم من خوادم Google',
                  });
                  return;
                }
                const data = await res.json();
                if (!data.email) {
                  resolve({
                    success: false,
                    error: 'لم يقدم حساب Google عنوان بريد إلكتروني صالح',
                  });
                  return;
                }

                const authResult = await signInWithGoogle({
                  email: data.email,
                  name: data.name || data.email.split('@')[0],
                  avatarUrl: data.picture || '',
                });
                resolve(authResult);
              } catch (err: any) {
                resolve({
                  success: false,
                  error: 'تعذر التواصل مع Google: ' + err.message,
                });
              }
            } else {
              resolve({ success: false, error: 'لم يتم استلام رمز المصادقة من Google' });
            }
          },
          error_callback: (err: any) => {
            resolve({
              success: false,
              error: 'فشلت نافذة Google: ' + (err.message || 'تم إغلاق النافذة'),
            });
          },
        });

        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err: any) {
        resolve({
          success: false,
          error: 'فشل تشغيل Google OAuth: ' + err.message,
        });
      }
    });
  }

  // 3. If neither is configured, clearly inform the user without fake fallback:
  return {
    success: false,
    error: 'لتسجيل الدخول الفعلي بـ Google، يرجى تزويد التطبيق بـ VITE_GOOGLE_CLIENT_ID في إعدادات البيئة (Settings > Secrets) أو ربط Supabase.',
  };
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
  localStorage.removeItem(STORAGE_CURRENT_USER);
}

/**
 * Get active session user
 */
export async function getActiveUser(): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        return mapSupabaseUser(data.session.user);
      }
    } catch (err) {
      console.warn('Error fetching Supabase session:', err);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  name?: string;
  avatarUrl?: string;
  deviceName?: string;
}): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.name,
          avatar_url: updates.avatarUrl,
          device_name: updates.deviceName,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        return { success: true, user: mapSupabaseUser(data.user) };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Local fallback
  const raw = localStorage.getItem(STORAGE_CURRENT_USER);
  if (!raw) return { success: false, error: 'لا يوجد مستخدم مسجل حالياً' };

  const currentProfile: UserProfile = JSON.parse(raw);
  const updatedProfile: UserProfile = {
    ...currentProfile,
    name: updates.name !== undefined ? updates.name : currentProfile.name,
    avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : currentProfile.avatarUrl,
    deviceName: updates.deviceName !== undefined ? updates.deviceName : currentProfile.deviceName,
  };

  localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(updatedProfile));

  // Also update in users list
  const users = getStoredUsers();
  const updatedList = users.map((u) => {
    if (u.id === updatedProfile.id || u.email === updatedProfile.email) {
      return {
        ...u,
        name: updatedProfile.name,
        avatarUrl: updatedProfile.avatarUrl,
        deviceName: updatedProfile.deviceName,
      };
    }
    return u;
  });
  saveStoredUsers(updatedList);

  return { success: true, user: updatedProfile };
}
