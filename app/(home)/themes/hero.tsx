"use client"

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import CodeBlock from '@/components/ui/codeblock'
import { Tab, Tabs, TabsList, TabsView, TabView } from '@/components/ui/tabs'
import { useTheme } from '@/contexts/ui-theme-context'
import { fontApplier } from '@/twj-lib/font-applier'
import { cn } from 'fumadocs-ui/utils/cn'
import React from 'react'

const ThemesHero = () => {
     const {setTheme, theme} = useTheme()
        
          
    
          const fontClass = fontApplier(theme)
  return (
     <div className={`w-full  pt-25 pb-20 flex flex-col items-center justify-center bg-background dark:bg-background-dark transition-colors duration-200 ${fontClass} `}>
            <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center w-full ">
            
            {/* Announcement Badge */}
            <Badge label='Try to change themes' className=' ' />
    
            {/* Main Heading */}
            <h1 className={cn(" text-4xl mt-5 md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.1]", theme === 'brutalist' && 'uppercase')}>
               Change themes with<br className="hidden md:block" />
               just one click
            </h1>
    
            {/* Subheading */}
            <p className=" text-neutral-400 max-w-2xl mb-10 leading-relaxed">
                Explore our diverse themes and effortlessly switch between them to find the perfect look for your project.
            </p>
        </div>

        <div className='w-full max-w-7xl mt-10'>
            {/* Theme Selection Buttons */}
            <Tabs defaultValue='purple'>
                <TabsList>
                    <Tab tab="purple">Purple</Tab>
                    <Tab tab="blue">Blue</Tab>
                    <Tab tab="green">Green</Tab>
                    <Tab tab="red">Red</Tab>
                    <Tab tab="brutalist">Brutalist</Tab>
                </TabsList>
                <TabsView>
                    <TabView tab="purple">
                       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            <div>
                                <Card className='shadow-none'>

                                </Card>
                            </div>
                       </div>
                    </TabView>
                </TabsView>
            </Tabs>
        </div>
    </div>
  )
}

export default ThemesHero