"use client";

import React from 'react';
import { cn } from '@/twj-lib/tw';
import { fontApplier } from '@/twj-lib/font-applier';
import type { Theme, TWJComponentsProps } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';

/*
  ──────────────────────────────────────────────────────────────
  Badge COMPONENT
  This component supports:
  - Multiple variants (primary, secondary, outline, ghost)
  - Multiple sizes
  - Theming from context + optional override
  - Hydration-safe rendering for Next.js
  - Fully customizable via Tailwind + className
  ──────────────────────────────────────────────────────────────
*/

interface BadgeProps extends TWJComponentsProps {
    label?: string;                               // Text label for the badge
    children?: React.ReactNode;   
    prefix?: React.ReactNode;                     // Children (icons, text, etc.)
    theme?: Theme;                                // Theme override
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // Visual style
    size?: 'small' | 'default' | 'large';         // Badge size
    className?: string;                            // Additional custom classes
}


export const Badge = ({

    label,
  children,
  theme,
  prefix,
    variant = "primary",
  size = "default",
  className,
}: BadgeProps) => {

  // Get theme from UI context
  const { theme: contextTheme } = useTheme();

  // Fix hydration mismatch by only enabling theming on client
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Pick theme in priority: Prop → Context → Default("modern")
  const activeTheme = theme || contextTheme || "modern";

  // Before hydration finishes, keep theme stable
  const appliedTheme = mounted ? activeTheme : "modern";

  // Apply fonts + theme class
  const fontClass = fontApplier(appliedTheme);
  const themeClass = `theme-${appliedTheme}`;

  return (
    <div className={cn(
        themeClass,
        fontClass
    )}>
        <div className={cn(
            'flex items-center px-3 py-1 rounded-full border bg-surface dark:bg-surface-dark border-foreground/20 font-medium text-sm space-x-2 cursor-pointer',
            appliedTheme === 'brutalist' && 'border-2 rounded-none uppercase',
            size === 'small' && 'text-xs px-2 py-0.5',
            size === 'large' && 'text-lg px-4 py-2',
            variant === 'primary' && 'bg-primary dark:bg-primary-dark-mode text-primary-foreground border-primary/20',
            variant === 'secondary' && 'bg-secondary dark:bg-secondary-dark text-secondary-foreground border-foreground/15',
            variant === 'outline' && [
                'bg-transparent! text-foreground dark:text-foreground-dark border-border dark:border-border-dark',
                appliedTheme === 'brutalist' && 'border-2 border-foreground',
            ],
            variant === 'ghost' && 'bg-foreground/5 text-foreground dark:text-foreground border-transparent',
            className
        )}>
            {!prefix ? <span className={cn(
                'w-2 aspect-square rounded-full ',
                variant === 'primary' && 'bg-primary-foreground dark:bg-primary-foreground-dark',
                variant === 'secondary' && 'bg-secondary-foreground dark:bg-secondary-foreground-dark',
                variant === 'outline' && 'bg-accent dark:bg-accent-dark',
                variant === 'ghost' && 'bg-foreground dark:bg-foreground-dark',
            )} /> : prefix}
            
            <p>{label}</p>
        </div>
        {children}
    </div>
  )
};
