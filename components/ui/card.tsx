"use client"

import React from "react";
import type { Theme, TWJComponentsProps } from "@/twj-lib/types";
import { cn } from "@/twj-lib/tw";
import { fontApplier } from "@/twj-lib/font-applier";
import { useTheme, ThemeProvider } from "@/contexts/ui-theme-context";

// ----------------------------------------------------
// 🔵 Card Component
// ----------------------------------------------------
interface CardProps extends TWJComponentsProps {
  children?: React.ReactNode;
  className?: string; 
}

export const Card = ({ theme, children, className }: CardProps) => {
  const { theme: contextTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme || contextTheme || "modern";
  const appliedTheme = mounted ? activeTheme : "modern";

  const fontClass = fontApplier(appliedTheme);
  const themeClass = `theme-${appliedTheme}`;

  const childrenWithTheme = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        theme: appliedTheme 
      });
    }
    return child;
  });

  return (
    <ThemeProvider initialTheme={appliedTheme} key={appliedTheme}>
      <div 
        data-theme={appliedTheme} 
        className={cn(
          themeClass,
          fontClass,
          
          // --- BASE STYLES ---
          'rounded-theme font-semibold transition-all duration-200',
          'p-4 w-full focus:outline-none',

          // --- EXPLICIT DARK MODE SWITCHING ---
          // Light Mode Class            // Dark Mode Class
          'bg-card                       dark:bg-card-dark',
          'border border-border          dark:border-border-dark',
          'text-card-foreground          dark:text-card-foreground-dark',

          // --- BRUTALIST OVERRIDES ---
          appliedTheme === 'brutalist' && [
            'uppercase tracking-wider',
            
            // Explicitly swap border color for brutalist (Black -> White)
            'border-2 border-black dark:border-white', 
            
            // Explicitly swap shadow color (Black Shadow -> White Shadow)
            'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
          ],
          
          className 
        )}
      >
        {childrenWithTheme}
      </div>
    </ThemeProvider>
  );
};

// ----------------------------------------------------
// 🟣 Card Header
// ----------------------------------------------------
interface CardHeaderProps {
  title?: string;
  icon?: React.ReactNode;
  theme?: Theme; 
  description?: string;
  className?: string;
  children?: React.ReactNode; 
}

export const CardHeader = ({ title, icon, description, theme, className, children }: CardHeaderProps) => {
  return (
    <div className={cn(
        'mb-4 flex flex-col items-start gap-2',
        // Brutalist: Border Black -> White
        theme === 'brutalist' && 'border-b-2 border-black dark:border-white pb-4 mb-4',
        className
    )}>
      {/* Icon Wrapper */}
      {icon && (
        <div className={cn(
          'mb-2 text-2xl',
          theme === 'brutalist' && [
             'p-2 border-2',
             // Border: Black -> White
             'border-black dark:border-white', 
             
             // Background: Primary -> Primary Dark Mode
             'bg-primary dark:bg-primary-dark-mode', 
             
             // Text: Foreground -> Foreground Dark
             'text-primary-foreground dark:text-primary-foreground-dark',
             
             // Shadow: Black -> White
             'shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]'
          ]
        )}>
          {icon}
        </div>
      )}
      
      {/* Title */}
      {title && (
        <h2 className="text-2xl font-bold leading-none tracking-tight">
          {title}
        </h2>
      )}
      
      {/* Description */}
      {description && (
        <p className={cn(
          "text-sm",
          // Muted -> Muted Dark
          "text-muted-foreground dark:text-muted-foreground-dark"
        )}>
          {description}
        </p>
      )}

      {children}
    </div>
  );
};
CardHeader.displayName = "CardHeader";

// ----------------------------------------------------
// 🟢 Card Body
// ----------------------------------------------------
interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
  theme?: Theme; 
}

export const CardBody = ({ children, className, theme }: CardBodyProps) => {
  return (
    <div className={cn(
      "text-sm",
      // Foreground -> Foreground Dark
      "text-card-foreground dark:text-card-foreground-dark",
      className
    )}>
      {children}
    </div>
  );
};
CardBody.displayName = "CardBody";

// ----------------------------------------------------
// 🟠 Card Footer
// ----------------------------------------------------
interface CardFooterProps {
  children?: React.ReactNode;
  theme?: Theme;
  className?: string;
}

export const CardFooter = ({ children, className, theme }: CardFooterProps) => {
  return (
    <div className={cn(
      "flex items-center pt-4 mt-4",
      // Brutalist Divider: Black -> White
      theme === 'brutalist' && "pt-4  border-black dark:border-white", 
      className
    )}>
      {children}
    </div>
  );
};
CardFooter.displayName = "CardFooter";