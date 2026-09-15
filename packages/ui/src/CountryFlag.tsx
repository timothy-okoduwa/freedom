import React, { useState } from 'react';

export function flagEmojiToCountryCode(flagOrCode?: string): string {
  if (!flagOrCode) return 'ng';
  let clean = flagOrCode.trim();
  if (clean.toUpperCase() === 'UK') clean = 'GB';
  if (/^[A-Za-z]{2}$/.test(clean)) return clean.toLowerCase();
  const chars = Array.from(clean);
  if (chars.length >= 2) {
    const p1 = chars[0].codePointAt(0) || 0;
    const p2 = chars[1].codePointAt(0) || 0;
    if (p1 >= 0x1F1E6 && p1 <= 0x1F1FF && p2 >= 0x1F1E6 && p2 <= 0x1F1FF) {
      const c1 = String.fromCharCode(p1 - 0x1F1E6 + 65);
      const c2 = String.fromCharCode(p2 - 0x1F1E6 + 65);
      return (c1 + c2).toLowerCase();
    }
  }
  return 'ng';
}

export interface CountryFlagProps {
  flag?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CountryFlag({ flag, className, size = 'md' }: CountryFlagProps) {
  const [error, setError] = useState(false);
  const code = flagEmojiToCountryCode(flag);

  const sizeClasses =
    size === 'sm'
      ? 'w-4 h-3'
      : size === 'lg'
      ? 'w-6 h-4.5'
      : 'w-5 h-3.5';

  if (error) {
    return (
      <span className={`inline-flex items-center justify-center font-mono text-[10px] font-bold px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 ${className || ''}`}>
        {code.toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      alt={code.toUpperCase()}
      onError={() => setError(true)}
      className={`${sizeClasses} object-cover rounded-[2px] border border-black/10 inline-block align-middle shrink-0 ${className || ''}`}
      loading="lazy"
    />
  );
}
