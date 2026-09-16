'use client';

import { useState, useEffect } from 'react';

export type UserOS = 'mac' | 'windows';

export function useUserOS(): UserOS {
  const [os, setOS] = useState<UserOS>('mac');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('win')) {
        setOS('windows');
      } else {
        setOS('mac');
      }
    }
  }, []);

  return os;
}
