"use client";

import React, { createContext, useContext, useState } from "react";
import type { Theme } from "@/twj-lib/types"; 

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "modern", 
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  // ✅ 1. Initialize State with the prop. 
  // This happens once on mount. You don't need useEffect to set this.
  const [theme, setTheme] = useState<Theme>(initialTheme);

  // ❌ REMOVED: The useEffect was causing the double-render/sync error.
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}