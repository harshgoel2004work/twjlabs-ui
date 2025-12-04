"use client";

import React from 'react';
import { cn } from '@/twj-lib/tw';
import { fontApplier } from '@/twj-lib/font-applier';
import type { TWJAIComponentsProps, TWJComponentsProps } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';
import { useAIControl } from '@/contexts/ai-context'; // Adjust path to where your hook is

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'link' | 'ghost';
type ButtonSize = 'small' | 'default' | 'large' | 'icon';

interface ButtonProps extends TWJAIComponentsProps {
  label?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const Button = ({
  label,
  children,
  onClick,
  theme,
  variant = "primary",
  size = "default",
  className,
  aiID,
  aiDescription,
  ...props
}: ButtonProps & React.ComponentProps<"button">) => {

  const { theme: contextTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 🤖 Register with the Brain
  // We wrap the onClick so the AI can trigger "click"
 if (aiID) {
   useAIControl({
    id: aiID || '', 
    description: aiDescription || '',
    actions: {
      click: async () => {
        if (onClick) onClick();
      }
    }
  });
 }

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme || contextTheme || "modern";
  const appliedTheme = mounted ? activeTheme : "modern";
  const fontClass = fontApplier(appliedTheme);
  const themeClass = `theme-${appliedTheme}`;

  return (
    <button
      onClick={onClick}
      {...props}
      className={cn(
        themeClass,
        fontClass,
        'rounded-theme font-semibold transition-all duration-200 cursor-pointer w-fit',
        'focus:outline-none',
        size === 'small' && 'text-sm py-2 px-4',
        size === 'default' && 'text-base py-2.5 px-6',
        size === 'large' && 'text-lg py-3 px-8',
        size === 'icon' && 'p-2 flex items-center justify-center aspect-square w-full max-w-10',
        
        // Variants
        variant === 'primary' && [
          'bg-primary dark:bg-primary-dark-mode text-white hover:bg-primary-dark',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          appliedTheme === 'futuristic' && 'shadow-[0px_0px_15px_0px_var(--color-primary)]',
          appliedTheme === 'brutalist' && 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]! dark:shadow-accent! bg-primary! dark:bg-primary-dark-mode! text-background! hover:bg-primary/80!',
          appliedTheme === 'modern' && 'bg-gradient-to-r! from-[var(--color-gradient-one)]! to-[var(--color-gradient-three)]! text-white'
        ],
        variant === 'secondary' && [
          'bg-surface text-foreground border border-muted/20 hover:bg-muted/10',
          appliedTheme === 'brutalist' && 'bg-gray-200 border-2 border-black'
        ],
        variant === 'outline' && 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
        variant === 'ghost' && 'bg-transparent text-foreground hover:bg-muted/20',
        appliedTheme === 'brutalist' && [
          'bg-background text-foreground uppercase tracking-wider border-2 border-black',
          'hover:bg-primary hover:text-background',
          'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          'active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
        ],
        className
      )}
    >
      {label}
      {children}
    </button>
  );
};