"use client"

import { useTheme } from '@/contexts/ui-theme-context'
import { fontApplier } from '@/twj-lib/font-applier'
import { TWJComponentsProps } from '@/twj-lib/types'
import React from 'react'

interface HeadingProps extends TWJComponentsProps {
    level?: 1 | 2 | 3 | 4 | 5 | 6
    children?: React.ReactNode
    className?: string
}

const Heading = ({ level = 1, children, theme, className }: HeadingProps) => {
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
    <>
    {level === 1 && <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h1>}
    {level === 2 && <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h2>}
    {level === 3 && <h3 className={`text-2xl md:text-4xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h3>}
    {level === 4 && <h4 className={`text-xl md:text-3xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h4>}
    {level === 5 && <h5 className={`text-lg md:text-2xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h5>}
    {level === 6 && <h6 className={`text-base md:text-xl font-bold mb-6 ${fontClass} ${themeClass} ${className || ''}`}>{children}</h6>}
    </>
  )
}

export default Heading