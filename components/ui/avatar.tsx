"use client"

import { useTheme } from '@/contexts/ui-theme-context';
import { fontApplier } from '@/twj-lib/font-applier';
import { cn } from '@/twj-lib/tw';
import { TWJComponentsProps } from '@/twj-lib/types'
import { User2 } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

interface AvatarProps extends TWJComponentsProps {
    size?: 'small' | 'medium' | 'large';
    src?: string;
    alt?: string;
    fallbackIcon?: React.ReactNode;
    className?: string;
}

const CustomUserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>

)

const Avatar = ({
    size = 'medium',
    src,
    alt = 'User Avatar',
    fallbackIcon=<CustomUserIcon />,
    theme,
    className,
}: AvatarProps) => {
    const {theme:contextTheme} = useTheme();

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
  return (
    <div className={cn(
        themeClass,
        fontClass,
        'group relative rounded-full overflow-hidden bg-surface border border-foreground/20 flex items-center justify-center',
        
        size === 'small' && 'w-8 h-8',
        size === 'medium' && 'w-12 h-12',
        size === 'large' && 'w-16 h-16',
        appliedTheme === 'brutalist' && ['border-2 rounded-theme border-foreground ','shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'],
        className
    )}>
        <div className='absolute -left-[0%] -top-[0%] -translate-x-1/2 -translate-y-1/2 group-hover:translate-x-[100%] group-hover:translate-y-[400%] w-[150%] aspect-[4/1] rotate-135 bg-linear-to-b from-transparent via-white/30 blur-sm to-transparent z-10 transition duration-1000 ease-in-out '>

        </div>

        {src ? (
            <Image 
            src={src}
            alt={alt}
            
            fill 
            className='object-cover'
            />
        ):(
            fallbackIcon && (
                <div className='w-full h-full flex items-center text-muted-foreground justify-center'>
                    {fallbackIcon}
                </div>)
        )}
 
    </div>
  )
}

export default Avatar