'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Client component that copies referral code to clipboard for deferred deep linking.
 * Renders nothing — just runs the side effect.
 */
export default function RefClipboard() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      navigator.clipboard.writeText(`FREEPORT_REF:${ref}`).catch(() => {});
    }
  }, [searchParams]);

  return null;
}
