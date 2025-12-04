"use client"

import { useTheme } from '@/contexts/ui-theme-context'
import { fontApplier } from '@/twj-lib/font-applier'
import { cn } from '@/twj-lib/tw'
import { TWJComponentsProps } from '@/twj-lib/types'
import React from 'react'

interface TextProps extends TWJComponentsProps {
    variant?: 'default' | 'secondary' | 'muted'
    children: React.ReactNode
    className?: string
}

const Text = ({ variant = 'default', children, theme, className }: TextProps) => {
    const { theme: contextTheme } = useTheme();
      const [mounted, setMounted] = React.useState(false);
    
      React.useEffect(() => {
        setMounted(true);
      }, []);
    
      const activeTheme = theme || contextTheme || "modern";
      const appliedTheme = mounted ? activeTheme : "modern";
    
      const fontClass = fontApplier(appliedTheme);
      const themeClass = `theme-${appliedTheme}`;
  return (
    <p className={cn(
        `text-lg md:text-xl mb-6 ${fontClass} ${themeClass} ${className || ''}`,
        variant === 'default' && 'text-neutral-400',
        variant === 'secondary' && 'text-neutral-500',
        variant === 'muted' && 'text-neutral-600',
    )}>
        {children}
    </p>
  )
}

export default Text