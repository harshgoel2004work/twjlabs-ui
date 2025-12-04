"use client"

import React, { useRef, useEffect } from 'react'
import { cn } from '@/twj-lib/tw';
import { fontApplier } from '@/twj-lib/font-applier';
import type { Theme, TWJAIComponentsProps } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';
import { useAIControl } from '@/contexts/ai-context';

interface InputProps extends TWJAIComponentsProps {
  theme?: Theme;
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ theme, className, aiID, aiDescription, ...props }, forwardedRef) => {
    
    const { theme: contextTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    
    // Internal ref
    const internalRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    // 🧠 THE BRAIN: Register the actions
    useAIControl({
      id: aiID || '', 
      description: aiDescription || '',
      actions: {
        // ✅ FIX 1: Allow 'any' type to catch mismatches
        setValue: async (text: any) => {
           // ✅ FIX 2: Sanitize. If text is null/undefined, use empty string.
           // We also wrap in String() just in case the AI sends a number (like 123)
           const safeText = (text === undefined || text === null) ? "" : String(text);
           triggerChange(safeText);
        },
        clear: async () => {
           triggerChange("");
        }
      }
    });

    // THE MECHANIC
    const triggerChange = (newValue: string) => {
        const input = internalRef.current;
        if (!input) return;

        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype, 
          "value"
        )?.set;

        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, newValue);
        }

        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
    };

    const activeTheme = theme || contextTheme || "modern";
    const appliedTheme = mounted ? activeTheme : "modern";
    const fontClass = fontApplier(appliedTheme);
    const themeClass = `theme-${appliedTheme}`;

    return (
      <input
        ref={(node) => {
            internalRef.current = node;
            if (typeof forwardedRef === 'function') {
                forwardedRef(node);
            } else if (forwardedRef) {
                (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            }
        }}
        {...props}
        className={cn(
          themeClass,
          fontClass,
          'rounded-theme border border-muted/30 bg-surface p-2 transition',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          'text-foreground ',
          appliedTheme === 'organic' && 'rounded-full!',
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

Input.displayName = "Input";

export default Input