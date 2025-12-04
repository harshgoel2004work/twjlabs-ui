"use client"

import React, { useState } from 'react';
import { cn } from '@/twj-lib/tw'; 
import { fontApplier } from '@/twj-lib/font-applier';
import type { Theme } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';
// 1. Import the AI Hook
import { useAIControl } from '@/contexts/ai-context';

interface SwitchProps {
  /** Whether the switch is checked (on) or not (off). */
  checked?: boolean;
  /** Callback function when the state changes. */
  onCheckedChange?: (checked: boolean) => void;
  /** Optional text label to display next to the switch. */
  label?: string;
  /** The overall theme style to apply. */
  theme?: Theme;
  className?: string;
  
  // 🤖 2. Add AI Props
  aiID?: string;          // e.g. "airplane-mode-switch"
  aiDescription?: string; // e.g. "Toggles airplane mode on or off"
}

export const Switch = ({
  checked = false,
  onCheckedChange,
  label,
  theme,
  className,
  aiID,
  aiDescription,
  ...props
}: SwitchProps & React.ComponentPropsWithoutRef<"input">) => {
  // Get theme from UI context
  const { theme: contextTheme } = useTheme();

  const [checkedState, setCheckedState] = useState(checked);

  // Sync prop changes to local state
  React.useEffect(() => {
    setCheckedState(checked);
  }, [checked]);

  if(aiID) {
    // 🤖 3. Connect to Brain
  useAIControl({
    id: aiID || '',
    description: aiDescription || '',
    actions: {
      // AI Action 1: Explicitly Turn On
      turnOn: async () => {
        if (!checkedState) {
          setCheckedState(true);
          onCheckedChange?.(true);
        }
      },
      // AI Action 2: Explicitly Turn Off
      turnOff: async () => {
        if (checkedState) {
          setCheckedState(false);
          onCheckedChange?.(false);
        }
      },
      // AI Action 3: Toggle
      toggle: async () => {
        const nextState = !checkedState;
        setCheckedState(nextState);
        onCheckedChange?.(nextState);
      }
    }
  });
  }

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

  // --- BASE STYLES ---
  const trackBaseClasses = "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full  border-transparent transition-colors duration-200 ease-in-out focus:outline-none p-0.5";
  const thumbBaseClasses = "pointer-events-none inline-block h-full aspect-square rounded-full shadow-lg transform ring-0 transition duration-200 ease-in-out ";

  // --- THEME STYLES LOGIC ---
  const getTrackStyles = (isChecked: boolean) => {
    let uncheckedTrack = "bg-muted/50";
    let checkedTrack = "bg-primary"; 

    switch (appliedTheme) {
      case 'brutalist':
        uncheckedTrack = "bg-gray-300 border-2 border-black rounded-none p-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
        checkedTrack = "bg-gray-300 border-2 border-black rounded-none p-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
        break;
      case 'futuristic':
        uncheckedTrack = "bg-white/10 border border-primary/40";
        checkedTrack = "bg-primary/50 border border-primary/80 shadow-[0px_0px_10px_0px_var(--color-primary)]";
        break;
      case 'organic':
        uncheckedTrack = "bg-gray-200";
        checkedTrack = "bg-green-600";
        break;
      case 'modern':
        checkedTrack = "bg-gradient-to-r from-[var(--color-gradient-one)] to-[var(--color-gradient-two)] ";
        uncheckedTrack = "bg-gradient-to-r from-gray-300 to-gray-300 ";
        break;
      default:
        break;
    }

    return isChecked 
      ? cn(trackBaseClasses, checkedTrack) 
      : cn(trackBaseClasses, uncheckedTrack);
  }
  
  const getThumbStyles = (isChecked: boolean) => {
    let thumbColor = "bg-white";

    switch (appliedTheme) {
      case 'brutalist':
        thumbColor = isChecked ? "bg-primary rounded-none p-0" : "bg-white rounded-none p-0";
        break;
      case 'futuristic':
        thumbColor = "bg-primary shadow-[0_0_8px_rgba(255,255,255,0.6)]";
        break;
      default:
        thumbColor = "bg-white";
        break;
    }

    const position = isChecked 
      ? "translate-x-5" 
      : "translate-x-0";

    return cn(thumbBaseClasses, thumbColor, position);
  }
  
  const id = label ? `switch-${label.replace(/\s/g, '-')}` : `switch-id-${Math.random().toString(36).substring(7)}`;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onCheckedChange && onCheckedChange(e.target.checked);
    setCheckedState(e.target.checked);
  }

  return (
    <label 
      htmlFor={id}
      className={cn(themeClass, fontClass, "flex items-center space-x-3 cursor-pointer select-none", className)}
    >
      <input
        id={id}
        type="checkbox"
        checked={checkedState}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />
      
      <span
        aria-hidden="true"
        className={getTrackStyles(checkedState)}
      >
        <span
          aria-hidden="true"
          className={cn(getThumbStyles(checkedState), '')}
        />
      </span>
      
      {label && (
        <span className={`${fontApplier(appliedTheme)}`}>
          {label}
        </span>
      )}
    </label>
  );
};