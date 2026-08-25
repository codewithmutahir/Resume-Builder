import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Apple-style activity indicator (12 radial spokes).
 */
export const AppleLoader = ({
  size = 18,
  className,
  label,
  labelClassName,
  tone = 'dark', // dark | light | primary
}) => {
  const spokeClass =
    tone === 'light'
      ? 'bg-white'
      : tone === 'primary'
        ? 'bg-primary'
        : 'bg-neutral-700';

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-label={label || 'Loading'}
    >
      <span
        className="apple-spinner relative inline-block shrink-0"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={cn('apple-spinner-spoke absolute left-1/2 top-0 rounded-full', spokeClass)}
            style={{
              width: Math.max(2, size * 0.12),
              height: size * 0.28,
              marginLeft: -Math.max(1, size * 0.06),
              transformOrigin: `50% ${size / 2}px`,
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${-(1.1 - i * 0.1)}s`,
            }}
          />
        ))}
      </span>
      {label ? (
        <span className={cn('text-sm font-medium text-foreground', labelClassName)}>
          {label}
        </span>
      ) : null}
    </span>
  );
};

export default AppleLoader;
