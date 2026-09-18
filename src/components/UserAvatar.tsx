import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

const GRADIENT_PALETTES = [
  'from-blue-600 to-indigo-600',
  'from-indigo-600 to-purple-600',
  'from-purple-600 to-pink-600',
  'from-pink-600 to-rose-600',
  'from-emerald-600 to-teal-600',
  'from-teal-600 to-cyan-600',
  'from-amber-600 to-orange-600',
  'from-cyan-600 to-blue-600',
];

export function getDeterministicGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
}

export function getUserInitials(name?: string): string {
  if (!name || !name.trim()) return 'QD';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  avatarUrl,
  size = 'md',
  className = '',
  showStatus = false,
  isOnline = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-28 h-28 text-3xl font-bold',
  };

  const statusDotSizes = {
    xs: 'w-1.5 h-1.5 bottom-0 right-0',
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0 ring-2',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 ring-2',
    xl: 'w-4 h-4 bottom-1 right-1 ring-2',
    '2xl': 'w-5 h-5 bottom-1.5 right-1.5 ring-3',
  };

  const initials = getUserInitials(name);
  const gradient = getDeterministicGradient(name);

  const hasValidImage = Boolean(avatarUrl && !imageError);

  return (
    <div className={`relative inline-flex shrink-0 select-none rounded-full ${sizeClasses[size]} ${className}`}>
      <div
        className="w-full h-full rounded-full overflow-hidden flex items-center justify-center shadow-xs transition-transform duration-200"
      >
        {hasValidImage ? (
          <img
            src={avatarUrl!}
            alt={name}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className={`w-full h-full rounded-full bg-gradient-to-tr ${gradient} text-white flex items-center justify-center font-bold tracking-wider uppercase shadow-inner`}
            title={name}
          >
            {initials}
          </div>
        )}
      </div>

      {showStatus && (
        <span
          className={`absolute rounded-full ring-white dark:ring-zinc-900 ${
            statusDotSizes[size]
          } ${isOnline ? 'bg-emerald-500' : 'bg-zinc-400'}`}
        />
      )}
    </div>
  );
};
