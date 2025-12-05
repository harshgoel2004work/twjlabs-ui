"use client"

import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { 
  Check, Copy, Code2, Eye, RefreshCw, Palette, ChevronDown, 
  Settings, Sun, Moon // Added Sun and Moon icons
} from 'lucide-react';
import { themes } from 'prism-react-renderer';
import { Theme, themes as twjThemes } from '@/twj-lib/types';
import { Switch } from './ui/switch';

// --- IMPORT YOUR COMPONENTS HERE ---
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/card';
import { Tabs, Tab,TabView,TabsList,TabsView } from './ui/tabs';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

// Mock Input
const Input = (props: any) => <input {...props} className="border p-2 rounded bg-transparent dark:border-neutral-700" />;

interface ComponentPlaygroundProps {
  code: string;
  scope?: Record<string, any>; 
  title?: string;
  description?: string;
  noInline?: boolean;
  availableThemes?: Theme[];
  variants?: string[];
}

export default function ComponentPlayground({ 
  code: initialCode, 
  scope = {}, 
  title = "Component Preview", 
  description,
  noInline = false,
  variants=undefined,
  availableThemes = twjThemes 
}: ComponentPlaygroundProps) {

  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [width, setWidth] = useState<'100%' | '768px' | '375px'>('100%');
  const [isCopied, setIsCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  

  const {setTheme, theme} = useTheme()

  // 1. New State for Local Dark Mode
  const [isDark, setIsDark] = useState(theme === 'dark');

  const [code, setCode] = useState(initialCode);
  const [currentTheme, setCurrentTheme] = useState<Theme>('modern');
  const [currentVariant, setCurrentVariant] = useState<string | undefined>(variants ? variants[0] : undefined);

  useEffect(() => {
    const match = initialCode.match(/theme=(["'])(.*?)\1/);
    if (match && match[2]) setCurrentTheme(match[2] as Theme);
  }, [initialCode]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setRefreshKey(prev => prev + 1);
    setCode(initialCode); 
    const match = initialCode.match(/theme=(["'])(.*?)\1/);
    if (match && match[2]) setCurrentTheme(match[2] as Theme);
  };

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme as Theme);
    const newCode = code.replace(/theme=(["'])(.*?)\1/g, `theme="${newTheme}"`);
    setCode(newCode);
  };

  const handleVariantChange = (newVariant: string) => {
    setCurrentVariant(newVariant);
    const newCode = code.replace(/variant=(["'])(.*?)\1/g, `variant="${newVariant}"`);
    setCode(newCode);
  }

  const builtInScope = {
    React,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Tabs,
    Tab,
    TabView,
    TabsList,
    TabsView,
    Button,
    Switch,
    Input,
    Settings,
    ...scope 
  };

  return (
    // 2. Wrap everything in a div that conditionally applies the 'dark' class.
    // This isolates the theme to just this block.
    <div>
      <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm transition-colors duration-200 overflow-hidden">
        <LiveProvider 
          key={refreshKey}
          code={code} 
          scope={builtInScope} 
          noInline={noInline} 
          theme={themes.vsDark}
        >
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-sm gap-4 transition-colors duration-200">
             
             {/* Left Side Controls */}
             <div className="flex items-center gap-4">
              <div className="flex items-center p-1 rounded-lg bg-neutral-200/50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'preview' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'}`}>
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'code' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'}`}>
                  <Code2 className="w-3.5 h-3.5" /> Code
                </button>
              </div>

              {/* Theme Selector */}
              <div className="relative group flex items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Theme:</span>
                  <select value={currentTheme} onChange={(e) => handleThemeChange(e.target.value)} className="bg-transparent border-none outline-none text-neutral-900 dark:text-white font-medium appearance-none cursor-pointer pl-1 pr-6" style={{ backgroundImage: 'none' }}>
                    {availableThemes.map(t => (
                      <option className='bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white' key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-3 pointer-events-none text-neutral-500" />
                </div>
              </div>

              {/* Variant Selector */}
              {variants && activeTab === 'preview' && (
                <div className="relative group flex items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md text-xs text-neutral-600 dark:text-neutral-400">
                    <span className="hidden sm:inline">Variant:</span>
                    <select value={currentVariant} onChange={(e) => handleVariantChange(e.target.value)} className="bg-transparent border-none outline-none text-neutral-900 dark:text-white font-medium appearance-none cursor-pointer pl-1 pr-6" style={{ backgroundImage: 'none' }}>
                      {variants.map(t => (
                        <option className='bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white' key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-3 pointer-events-none text-neutral-500" />
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2">
               
               {/* 3. Dark Mode Toggle Button */}
               <button 
                  onClick={() => {
                    setTheme(isDark ? 'light' : 'dark');
                    setIsDark(!isDark);
                  }}
                  className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
               >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
               </button>

               <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-800 mx-1"></div>

              {activeTab === 'preview' && (
                <div className="hidden sm:flex items-center gap-1 text-neutral-500">
                  <button onClick={handleReset} title="Reset Code" className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button onClick={() => handleCopy(code)} className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white ml-2 transition-colors">
                {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`relative w-full h-fit bg-neutral-100 dark:bg-neutral-950 transition-colors duration-200 overflow-hidden `}>
            {activeTab === 'preview' ? (
              <div className="w-full h-full min-h-[400px] p-8 flex justify-center items-start overflow-auto bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="" style={{ width: width }}>
                   <div className="p-10">
                      <LivePreview />
                   </div>
                   <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 text-sm p-4 border-t border-red-200 dark:border-red-900/50 empty:hidden">
                      <LiveError />
                   </div>
                </div>
              </div>
            ) : (
               <LiveEditor disabled className="font-mono text-sm leading-relaxed p-4 focus:outline-none bg-[#1e1e1e]!" />
            )}
          </div>

          {description && (
            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-xs text-neutral-500">
              {description}
            </div>
          )}
        </LiveProvider>
      </div>
    </div>
  );
}