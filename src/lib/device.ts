import { DeviceInfo, DeviceType } from '../types.ts';

export function getLocalDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent || '';
  
  let os = 'Unknown OS';
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS';
  } else if (/Android/.test(ua)) {
    os = 'Android';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macOS';
  } else if (/Windows NT/.test(ua)) {
    os = 'Windows';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  }

  let browser = 'Browser';
  if (/Edg\//.test(ua)) {
    browser = 'Edge';
  } else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
    browser = 'Chrome';
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browser = 'Safari';
  } else if (/Firefox\//.test(ua)) {
    browser = 'Firefox';
  } else if (/OPR\//.test(ua) || /Opera\//.test(ua)) {
    browser = 'Opera';
  }

  let type: DeviceType = 'desktop';
  if (/Mobi|Android|iPhone/i.test(ua)) {
    type = 'mobile';
  } else if (/iPad|Tablet/i.test(ua) || (os === 'macOS' && navigator.maxTouchPoints > 1)) {
    type = 'tablet';
  }

  const name = `${browser} on ${os}`;

  return {
    name,
    os,
    browser,
    type,
  };
}
