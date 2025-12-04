"use client"

import React, { useRef, useState, useEffect } from 'react';
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CustomCodeBlock({ ref: _ref, ...props }: React.ComponentProps<'pre'>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const MAX_HEIGHT = 300; 

  useEffect(() => {
    if (containerRef.current) {
      if (containerRef.current.scrollHeight > MAX_HEIGHT) {
        setIsOverflowing(true);
      }
    }
  }, [props.children]);

  return (
    <CodeBlock {...props} className="my-4">
      <div 
        ref={containerRef}
        // KEY CHANGE 1: 
        // We use 'overflow-x-auto' on the CONTAINER to handle horizontal scrolling.
        // We use 'overflow-y-hidden' only when collapsed to clip the height.
        className={`relative transition-[max-height] duration-300 ease-in-out overflow-x-auto ${
           !isExpanded && isOverflowing 
             ? 'max-h-[300px] overflow-y-hidden' 
             : 'max-h-none overflow-y-visible'
        }`}
      >
        {/* KEY CHANGE 2: 
            We force the Pre tag to be visible (!overflow-visible) so it doesn't 
            create its own internal scrollbar. It forces the parent div to scroll instead. 
            'min-w-full' ensures the background color extends fully.
        */}
        <Pre className="!overflow-visible min-w-full">
            {props.children}
        </Pre>

        {!isExpanded && isOverflowing && (
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
        )}
      </div>

      {isOverflowing && (
        <div className="w-full flex justify-center border-t border-white/10 bg-neutral-900/30 p-2 rounded-b-lg">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1 rounded-full hover:bg-neutral-800"
            >
                {isExpanded ? (
                    <>Show Less <ChevronUp className="w-3 h-3" /></>
                ) : (
                    <>Show More <ChevronDown className="w-3 h-3" /></>
                )}
            </button>
        </div>
      )}
    </CodeBlock>
  );
}