"use client"

import React, { useState } from 'react'
import { HeroOne } from './ui/hero-section-one'
import Link from 'next/link'
import { ArrowRight, Check, Copy, Terminal } from 'lucide-react'
import { Badge } from './ui/badge'
import { useTheme } from '@/contexts/ui-theme-context'
import { Button } from './ui/button'
import { Theme, themes } from '@/twj-lib/types'
import { fontApplier } from '@/twj-lib/font-applier'
import { cn } from '@/twj-lib/tw'

const HeroSectionDynamic = () => {
    const [copied, setCopied] = useState(false);
      const installCommand = "npx @twjlabs/ui init";

      const {setTheme, theme} = useTheme()
    
      const handleCopy = () => {
        navigator.clipboard.writeText(installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      const fontClass = fontApplier(theme)

      const handleCycleTheme = () => {
  // 1. Find the index of the current theme
  const currentIndex = themes.indexOf(theme);

  // 2. Calculate the next index
  // The % operator ensures that if (currentIndex + 1) equals the length,
  // it wraps back to 0.
  const nextIndex = (currentIndex + 1) % themes.length;

  // 3. Set the new theme
  setTheme(themes[nextIndex]);
};
  return (
    <div className={`w-full  pt-25 pb-20 flex items-center justify-center bg-background dark:bg-background-dark transition-colors duration-200 ${fontClass} `}>
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center w-full ">
        
        {/* Announcement Badge */}
        <Badge label='v2 is now live' className=' ' variant='primary'/>

        {/* Main Heading */}
        <h1 className={cn(" text-4xl mt-3 md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl ", theme === 'brutalist' && 'uppercase')}>
          Build beautiful interfaces <br className="hidden md:block" />
          at warp speed
        </h1>

        {/* Subheading */}
        <p className=" text-neutral-400 max-w-2xl mb-10 leading-relaxed">
          A collection of accessible, reusable, and composable React components. 
          Styled with Tailwind CSS and designed for modern web applications.
        </p>

        {/* Action Area */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          
          {/* Primary Button */}
         
          <Button onClick={handleCycleTheme}>Change Theme</Button>

          {/* Code/Terminal Snippet */}
          <div className={`relative group flex items-center gap-3 px-5 py-3.5 bg-accent dark:bg-accent-dark border border-border dark:border-border-dark font-mono text-sm text-accent-foreground dark:text-accent-foreground-dark backdrop-blur-md min-w-[280px] ${theme === 'brutalist' ? 'border-2' : 'rounded-md'} `}>
             <Terminal className="w-4 h-4 text-neutral-500" />
             <span>{installCommand}</span>
             <Button 
                onClick={handleCopy}
                size='small'
                className="absolute right-3 p-1.5 w-fit rounded-md transition-colors  "
             >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
             </Button>
          </div>
        </div>
        </div>
    </div>
  )
}

export default HeroSectionDynamic