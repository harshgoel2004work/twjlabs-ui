"use client"

import { ThemeProvider, useTheme } from '@/contexts/ui-theme-context'
import { fontApplier } from '@/twj-lib/font-applier'
import { cn } from '@/twj-lib/tw'
import { Theme, TWJComponentsProps } from '@/twj-lib/types'
import { AnimatePresence, motion } from 'motion/react'
import React, { createContext, useContext, useEffect, useState } from 'react'

// --- Main Context ---
type AccordionContextType = {
    selectedItems: string[]; 
    changeSelectedItem: (item: string) => void;
    theme: Theme;
    openType: "single" | "multiple"
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

export const useAccordionContext = () => {
    const context = useContext(AccordionContext)
    if (!context) {
        throw new Error("useAccordionContext must be used within an AccordionProvider")
    }
    return context
}

// --- Item Context ---
type AccordionItemContextType = {
    value: string
    isOpen: boolean
}
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined)

const useAccordionItemContext = () => {
    const context = useContext(AccordionItemContext)
    if (!context) {
        throw new Error("Accordion Sub-components must be used within an AccordionItem")
    }
    return context
}


// --- 1. Main Component ---
interface AccordionProps extends TWJComponentsProps {
    className?: string;
    children?: React.ReactNode;
    openType?: "single" | "multiple" 
    defaultValue?: string | string[] 
}

export const Accordion = ({ className, children, theme, defaultValue, openType = "single" }: AccordionProps) => {
    
    const [selectedItems, setSelectedItems] = useState<string[]>(() => {
        if (!defaultValue) return []
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    })

    const { theme: contextTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const id = setTimeout(() => setMounted(true), 0)
        return () => clearTimeout(id)
    }, [])

    const activeTheme = theme || contextTheme || "modern"
    const appliedTheme = mounted ? activeTheme : "modern"

    const fontClass = fontApplier(appliedTheme)
    const themeClass = `theme-${appliedTheme}`

    const handleValueChange = (itemValue: string) => {
        setSelectedItems((prevItems) => {
            // Case A: Multiple selection
            if (openType === "multiple") {
                return prevItems.includes(itemValue)
                    ? prevItems.filter((i) => i !== itemValue) // Remove if exists
                    : [...prevItems, itemValue]                // Add if new
            }

            // Case B: Single selection (default)
            // If clicking the currently open item, close it (return empty array)
            // Otherwise, replace the entire array with just the new item
            return prevItems.includes(itemValue) ? [] : [itemValue]
        })
    }

    const contextValue = {
        selectedItems,
        changeSelectedItem: handleValueChange,
        theme: appliedTheme,
        openType: openType
    }

    return (
        <AccordionContext.Provider value={contextValue}>
            <ThemeProvider initialTheme={appliedTheme} key={appliedTheme}>
                <div className={cn(
                    "flex flex-col w-full gap-2", 
                    fontClass,
                    themeClass,
                    className
                )}>
                    {children}
                </div>
            </ThemeProvider>
        </AccordionContext.Provider>
    )
}

// --- 2. Accordion Item ---
export const AccordionItem = ({ children, value, className }: { children: React.ReactNode, value: string, className?: string }) => {
    const { selectedItems, theme } = useAccordionContext()
    
    const isOpen = selectedItems.includes(value)

    return (
        <AccordionItemContext.Provider value={{ value, isOpen }}>
            <div className={cn(
                "accordion-item w-full overflow-hidden",
                "border rounded-theme bg-surface hover:bg-foreground/5", 
                
                theme === 'brutalist' && [
                    "border-2 border-foreground",
                    "shadow-[4px_4px_0_0_rgba(0,0,0,1)]",
                    isOpen && " transition-all"
                ],
                
                theme !== 'brutalist' && "border-foreground/10",
                
                className
            )}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    )
}

// --- 3. Accordion Trigger ---
export const AccordionTrigger = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const { changeSelectedItem } = useAccordionContext()
    const { value, isOpen } = useAccordionItemContext()

    return (
        <button 
            onClick={() => changeSelectedItem(value)}
            className={cn(
                "accordion-trigger",
                "flex items-center justify-between w-full p-4",
                "text-left font-medium transition-all ",
                "[&[data-state=open]>svg]:rotate-180", 
                className
            )}
            data-state={isOpen ? "open" : "closed"}
        >
            {children}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 transition-transform duration-200"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </button>
    )
}

// --- 4. Accordion Content ---
export const AccordionContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const { isOpen } = useAccordionItemContext()

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                        open: { opacity: 1, height: "auto" },
                        collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                >
                    <div className={cn("p-4 pt-0 text-muted", className)}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}