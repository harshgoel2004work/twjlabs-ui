"use client"

import { useTheme } from '@/contexts/ui-theme-context';
import { fontApplier } from '@/twj-lib/font-applier';
import { TWJComponentsProps } from '@/twj-lib/types';
import React from 'react'
import { cn } from '@/twj-lib/tw';
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus';


interface CodeBlockProps extends TWJComponentsProps {
    showLineNumbers?: boolean;
    code?: string;
    wrapLines?: boolean;
}

const CodeBlock = ({ code="", theme, showLineNumbers=false, wrapLines=false }: CodeBlockProps) => {
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
    <pre className={cn(
        themeClass,
        fontClass,
        'rounded-theme p-3 overflow-x-auto',
        'bg-surface dark:bg-surface-dark',
        'border rounded-theme border-foreground/20',
    )}>
        <SyntaxHighlighter language="python"  showLineNumbers={showLineNumbers} wrapLines={wrapLines} lineNumberStyle={{ color: '#888', paddingRight: '10px' }} customStyle={{background:'var(--background-surface)', margin:0, padding:0, color: 'var(--twj-foreground)'}} style={dark}>
            {code}
        </SyntaxHighlighter>
    </pre>
  )
}

export default CodeBlock