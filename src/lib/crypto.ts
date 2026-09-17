/**
 * Cryptographic and formatting utilities for QuickDrop
 */

export async function calculateSha256(data: ArrayBuffer): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) {
    return 'unsupported';
  }
  try {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('SHA-256 calculation error:', err);
    return 'error';
  }
}

/**
 * Sanitizes incoming filename to prevent path traversal, control chars, and OS restricted names.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return `quickdrop-file-${Date.now()}`;
  }

  // Remove any path indicators like / or \ or ..
  let clean = filename
    .replace(/^.*[\\/]/, '') // remove path
    .replace(/\.\./g, '') // remove parent traversal
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_') // remove invalid characters
    .trim();

  // If filename is empty or only dots
  if (!clean || /^[\s.]+$/.test(clean)) {
    clean = `quickdrop-file-${Date.now()}`;
  }

  // Limit max filename length to 120 chars while preserving extension
  if (clean.length > 120) {
    const extIdx = clean.lastIndexOf('.');
    if (extIdx > 0 && extIdx > clean.length - 10) {
      const ext = clean.substring(extIdx);
      clean = clean.substring(0, 110) + ext;
    } else {
      clean = clean.substring(0, 120);
    }
  }

  return clean;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  return `${parseFloat(val.toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (!bytesPerSec || bytesPerSec <= 0) return '0 KB/s';
  return `${formatBytes(bytesPerSec, 1)}/s`;
}

export function formatEta(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Calculating...';
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const mins = Math.floor(seconds / 60);
  const remainingSecs = Math.round(seconds % 60);
  if (mins < 60) {
    return `${mins}m ${remainingSecs}s`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

export function isValidUrl(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
