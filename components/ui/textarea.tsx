"use client"

import React from 'react'
import { cn } from '@/twj-lib/tw';
import { fontApplier } from '@/twj-lib/font-applier';
import type { Theme, TWJComponentsProps } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';

interface TextAreaProps extends TWJComponentsProps {
  theme?: Theme;
  className?: string;
}


const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ theme, className, ...props }, ref) => {
    
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
      <textarea
        // 3. IMPORTANT: Attach the ref here
        ref={ref}
        {...props}
        className={cn(
          themeClass,
          fontClass,
          'rounded-theme border border-muted/30 bg-surface p-2 transition',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'text-foreground ',
          
          appliedTheme === 'brutalist' && [
            'bg-background text-foreground font-brutalist uppercase tracking-wider border-2 border-black',
            'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
          ],
          className
        )}
      />
    )
  }
);

TextArea.displayName = "TextArea";

export default TextArea