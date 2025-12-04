"use client"

import React from 'react';
import { Box, Layers, Palette, ArrowRight, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { fontApplier } from '@/twj-lib/font-applier';
import { useTheme } from '@/contexts/ui-theme-context';
import { Card, CardHeader } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';

export default function FeaturesSection() {
  const {theme} = useTheme()
  const fontClass = fontApplier(theme)
  return (
    <section className={`relative py-20 md:py-30 overflow-hidden bg-background dark:bg-background-dark transition-colors duration-200 ${fontClass}`}>
      
      {/* Background Decor - Seamlessly blends with Hero */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            More than just components.
          </h2>
          <p className="text-neutral-400 text-lg">
            A complete ecosystem to speed up your development workflow. 
            Beautifully designed, fully accessible, and easy to customize.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">

          

          <Card className='col-span-2'>
            <CardHeader icon={<Box />} title='50+ Accessible Components' description='From essential buttons and inputs to complex data tables and calendar widgets. 
                  All components are fully typed and WAI-ARIA compliant.' className='border-none'/>
          </Card>

          {/* Feature 2: Prebuilt Sections (Tall Card) */}
          <Card className='col-span-1'>
            <CardHeader icon={<LayoutTemplate className="w-6 h-6" />} title='Prebuilt Sections' description='Drag-and-drop marketing sections. Hero, Pricing, FAQ, and Footer—ready to go.' className='border-none'/>
          </Card>


         
            {/* Feature 3: Theming (Tall Card) */}
            <Card className="col-span-1 p-0">
            <div className="group relative overflow-hidden ">
              <div className="absolute inset-0" />
              <div className="p-8 relative z-10">
                <Card className='w-fit bg-primary dark:bg-primary-dark-mode text-primary-foreground p-2.5'>
                  <Palette className="w-6 h-6" />
                </Card>
              
              <h3 className="text-2xl font-bold mb-2 mt-5">Global Theming</h3>
              <p className="text-neutral-400 text-sm mb-6">
                Change your brand feel in seconds. CSS variables for colors, fonts, and border radius.
              </p>

              {/* Visual: Color Dots */}
              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-offset-neutral-900 ring-blue-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-rose-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-amber-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-emerald-500 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
              </div>
            </div>
            </Card>

            {/* Feature 4: Tech Stack (Large Card) */}
            <Card className="md:col-span-2 p-0">
            <div className="group relative overflow-hidden ">
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <Card className='w-fit bg-primary dark:bg-primary-dark-mode text-primary-foreground p-2.5'>
                  <Layers className="w-6 h-6" />
                </Card>
                
                <h3 className="text-2xl font-bold mb-2 mt-4">Framework Agnostic*</h3>
                <p className="text-neutral-400 max-w-sm">
                Designed for React, but compatible with any framework that supports Tailwind CSS.
                Export to Vue, Svelte, or HTML with ease.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col text-sm text-neutral-400">
                <span className="font-medium text-white">React</span>
                <span>First-class support</span>
                </div>
                <div className="flex flex-col text-sm text-neutral-400">
                <span className="font-medium text-white">Vue / Svelte</span>
                <span>Easy to adapt</span>
                </div>
                <div className="flex flex-col text-sm text-neutral-400">
                <span className="font-medium text-white">HTML</span>
                <span>Static exports</span>
                </div>
              </div>
              </div>
            </div>
            </Card>
              
              {/* Action */}
              <Link href={'/docs'}>
              <Button className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all group-hover:translate-x-1">
                 View Documentation <ArrowRight className="w-4 h-4" />
              </Button>
              </Link>
            </div>
          </div>
          </section>

    
     
  );
}