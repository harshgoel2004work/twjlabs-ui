'use client'

import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, Logo } from '@/lib/layout.shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import { Brain, ComponentIcon, SectionIcon, Users2 } from 'lucide-react';
import { useTheme } from '@/contexts/ui-theme-context';
import { useEffect, useState } from 'react';
import { Theme } from '@/twj-lib/types';
import Link from 'next/link';

export default function Layout({ children }: LayoutProps<'/'>) {
  const {theme} = useTheme()
  const [themeClass, setThemeClass] = useState<Theme>('modern')
  useEffect(() => {
    setThemeClass(theme)
  },[theme])
  return <HomeLayout  {...baseOptions()} 
  nav={
    {
      children: [
        <Logo />
      ],
      url: '/',
    }
  }
          links={[
            {
          type: 'custom',
          // only displayed on navbar, not mobile menu
          on: 'nav',
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>
                <Link href="/docs">Documentation</Link>
              </NavbarMenuTrigger>
              <NavbarMenuContent className='grid grid-cols-3'>
                <NavbarMenuLink href="/docs/getting-started" className='row-span-2'>
                  <div className='flex flex-col h-full justify-end'>
                    <span className='text-indigo-400'><Users2 /></span>
                    <span className='font-semibold mt-3'>Getting Started</span>
                    <span className='text-sm font-medium text-neutral-500'>
                      Learn how to set up and use the component library.
                    </span>
                  </div>
                </NavbarMenuLink>
                <NavbarMenuLink href="/docs/components" className=''>
                  <div className='flex flex-col '>
                    <span className='text-indigo-400'><ComponentIcon /></span>
                    <span className='font-semibold mt-3'>Components</span>
                    <span className='text-sm font-medium text-neutral-500'>
                      Explore the full library of UI components and
                      utilities.
                    </span>
                  </div>
                </NavbarMenuLink>
                 <NavbarMenuLink href="/docs/ai-components" className=''>
                  <div className='flex flex-col '>
                    <span className='text-indigo-400'><Brain /></span>
                    <span className='font-semibold mt-3'>AI Components</span>
                    <span className='text-sm font-medium text-neutral-500'>
                      Discover AI-powered components to enhance your
                      applications.
                    </span>
                  </div>
                </NavbarMenuLink>
                <NavbarMenuLink href="/docs/sections" className=''>
                  <div className='flex flex-col '>
                    <span className='text-indigo-400'><SectionIcon /></span>
                    <span className='font-semibold mt-3'>Pre built Sections</span>
                    <span className='text-sm font-medium text-neutral-500'>
                      Browse pre-built sections to accelerate your design
                      process.
                    </span>
                  </div>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
        {
            type:'main',
          text: 'Documentation',
          url: '/docs/getting-started',
          active: 'url',
          on: 'menu'
        },
        {
           type:'main',
          text: 'Pricing',
          url: '/pricing',
          active: 'url'
        },
         {
           type:'main',
          text: 'Themes',
          url: '/themes',
          active: 'url'
        },
        {
           type:'button',
          text: 'TWJ Labs',
          url: 'https://www.twjlabs.com',
          active: 'url',
          secondary: true
        },
          ]}
          >
            <div className={`theme-${themeClass}`}>{children}</div></HomeLayout>;
}
