"use client"

import React, { useState, useRef, useEffect, useContext, createContext, type ReactNode } from 'react';
import { cn } from '@/twj-lib/tw'; 
import type { Theme, TWJComponentsProps } from '@/twj-lib/types'; 
// 1. Import specific Framer Motion types
import { motion, AnimatePresence, type Variants, type Transition } from "motion/react";
import { useTheme } from '@/contexts/ui-theme-context'; 
import { fontApplier } from '@/twj-lib/font-applier'; 

// 2. Type the helper return value
const getTransitionConfig = (theme: Theme): Transition => {
    switch (theme) {
      case 'playful':
        return { type: "spring", bounce: 0.5, duration: 0.4 };
      case 'brutalist':
        return { duration: 0.2, ease: "linear" };
      case 'futuristic':
        return { type: "spring", stiffness: 300, damping: 20 };
      case 'organic':
        return { duration: 0.4, ease: [0.22, 1, 0.36, 1] };
      default:
        return { duration: 0.2, ease: "easeOut" };
    }
};

// --- CONTEXT SETUP ---
interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeMenu: () => void;
  align: 'left' | 'right';
  // 3. FIX: Refs must be nullable
  menuRef: React.RefObject<HTMLDivElement | null>;
  // 4. FIX: Use specific Framer Motion types
  menuVariants: Variants; 
  transitionConfig: Transition; 
  activeTheme: Theme; 
}

const DropdownMenuContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (context === undefined) {
    throw new Error('Dropdown components must be used within <DropdownMenu>');
  }
  return context;
};

// --- CORE MENU COMPONENT ---

interface DropdownMenuProps extends TWJComponentsProps {
  children: ReactNode;
  align?: 'left' | 'right';
}

export const DropdownMenu = ({ 
  children, 
  theme: propTheme, 
  align = "left" 
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Ref initialization is correct here, it matches the context fix now
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { theme: contextTheme } = useTheme();
  const activeTheme = propTheme || contextTheme || "modern";

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeClass = `theme-${activeTheme}`;

  const menuVariants: Variants = {
    hidden: { 
      opacity: 0, y: -8, 
      scale: activeTheme === 'brutalist' ? 1 : 0.96,
      filter: activeTheme === 'futuristic' ? "blur(4px)" : "blur(0px)"
    },
    visible: { 
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)"
    },
    exit: { 
      opacity: 0, y: -8, 
      scale: activeTheme === 'brutalist' ? 1 : 0.96,
      filter: activeTheme === 'futuristic' ? "blur(2px)" : "blur(0px)"
    }
  };

  const contextValue: DropdownContextType = {
    isOpen, 
    setIsOpen, 
    closeMenu, 
    activeTheme, 
    align, 
    menuRef, 
    menuVariants, 
    transitionConfig: getTransitionConfig(activeTheme) 
  };

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <div 
        className={cn("relative inline-block text-left", themeClass)} 
        ref={menuRef}
      >
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

// --- SUB-COMPONENTS ---

interface DropdownMenuTriggerProps {
  children: ReactNode;
}

export const DropdownMenuTrigger = ({ children }: DropdownMenuTriggerProps) => {
  const { isOpen, setIsOpen, activeTheme } = useDropdownMenu();
  
  return React.cloneElement(children as React.ReactElement, {
    theme: activeTheme,
    onClick: (e: React.MouseEvent) => {
        // preserve existing onclick if it exists
        (children as any).props.onClick?.(e);
        setIsOpen(!isOpen);
    },
  });
};

interface DropdownMenuContentProps {
  children: ReactNode;
  className?: string;
}

export const DropdownMenuContent = ({ children, className }: DropdownMenuContentProps) => {
  const { isOpen, align, menuVariants, transitionConfig, activeTheme } = useDropdownMenu();
  const fontClass = fontApplier(activeTheme);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={menuVariants}
          transition={transitionConfig}
          className={cn(
            fontClass,
            "absolute z-50 min-w-[200px] origin-top-right overflow-hidden translate-y-1",
            align === 'right' ? 'right-0' : 'left-0',
            "bg-surface text-foreground font-theme rounded-theme",
            "border border-muted/20 shadow-lg",
            activeTheme === 'futuristic' && "border-primary/40 shadow-[0px_0px_20px_0px_var(--color-primary)] bg-background/90 backdrop-blur-md",
            activeTheme === 'brutalist' && [
              "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", "mt-1"
            ],
            activeTheme === 'elegant' && "border-none shadow-xl ring-1 ring-black/5",
            className
          )}
        >
          <div className="py-1" role="menu">
            {children} 
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  link?: string;
}

export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  disabled = false, 
  link,
  danger = false 
}: DropdownMenuItemProps) => {
  const { activeTheme, closeMenu } = useDropdownMenu();

  const handleClick = () => {
    if (disabled) return;

    if (link) {
        window.location.href = link;
        closeMenu();
        return;
    }
    onClick?.();
    closeMenu();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        fontApplier(activeTheme),
        "group flex w-full items-center px-4 py-2.5 text-sm text-left transition-colors duration-150",
        "hover:bg-muted/30 focus:bg-muted/30 focus:outline-none",
        link && "cursor-pointer",
        danger ? "text-red-500 hover:text-red-600 hover:bg-red-50" : "text-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        activeTheme === 'brutalist' && "hover:bg-primary hover:text-white hover:font-bold border-b border-transparent hover:border-black last:border-0",
        activeTheme === 'futuristic' && "hover:bg-primary/20 hover:text-primary hover:shadow-[inset_2px_0_0_0_var(--color-primary)]",
      )}
      role="menuitem"
    >
      {children}
    </button>
  );
};