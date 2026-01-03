"use client"

import { useTheme } from '@/contexts/ui-theme-context'
import { fontApplier } from '@/twj-lib/font-applier'
import { TWJComponentsProps } from '@/twj-lib/types'
import React from 'react'

interface ParagraphProps extends TWJComponentsProps {
  children?: React.ReactNode
  className?: string
}

const Paragraph = ({ children, theme, className }: ParagraphProps) => {
  const { theme: contextTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = theme || contextTheme || "modern"
  const appliedTheme = mounted ? activeTheme : "modern"

  const fontClass = fontApplier(appliedTheme)
  const themeClass = `theme-${appliedTheme}`

  return (
    <p
      className={`text-base md:text-lg leading-relaxed mb-4 ${fontClass} ${themeClass} ${className || ''}`}
    >
      {children}
    </p>
  )
}

export default Paragraph
