"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useAIContext } from '@/contexts/ai-context'; // Import our Brain
import { TWJComponentsProps } from '@/twj-lib/types'; // Your library types
import { useTheme } from '@/contexts/ui-theme-context';
import { fontApplier } from '@/twj-lib/font-applier';
import { askAI, AIMessage } from '@/actions/ask-ai';
import { Button } from '../button';
import { cn } from '@/twj-lib/tw';

// --- ICONS (Inline SVGs for zero dependencies) ---
const Icons = {
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>

  ),
  Bot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/></svg>
  )
};

// --- TYPES ---
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AIHelperProps extends TWJComponentsProps {
  greeting?: string;
    aiName?: string;
    alignment?: 'left' | 'right';
}

// --- MAIN COMPONENT ---
export const AIHelper: React.FC<AIHelperProps> = ({ 
  theme,
  greeting = "How can I help you navigate?",
  aiName = "AI Assistant",
  alignment = "right"
}) => {
  const { state, executeAction } = useAIContext(); // 🧠 Connecting to the Brain
  const {theme: contextTheme} = useTheme()
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

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
  
  // Local Chat State (Visual only for now)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: greeting }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // inside AIHelper.tsx

const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Snapshot current input
    const currentInput = input;
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: currentInput };

    // 2. Optimistic Update
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: loadingId, role: 'assistant', content: "Thinking..." }]);

    try {
        // 3. 🆕 Prepare History
        // We take the current 'messages' state (BEFORE the new input was added to state logic above, 
        // but since setMessages is async, we use the `messages` var directly).
        // CRITICAL: Filter out any previous "Thinking..." or error messages if you have them.
        
        const validHistory: AIMessage[] = messages
            .filter(m => m.content !== "Thinking..." && m.content !== "Error connecting to AI.")
            .map(m => ({
                role: m.role,
                content: m.content
            }));

        // 4. Call Server Action with History
        const response = await askAI(currentInput, state, validHistory);

        // 5. Update UI
        if (response.toolCall) {
            setMessages(prev => prev.map(msg => 
                msg.id === loadingId ? { ...msg, content: response.message } : msg
            ));

            await executeAction(
                response.toolCall.componentId, 
                response.toolCall.actionName,
                response.toolCall.actionValue
            );

            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    id: Date.now().toString(), 
                    role: 'assistant', 
                    content: "Done! ✅" 
                }]);
            }, 500);
        } else {
            setMessages(prev => prev.map(msg => 
                msg.id === loadingId ? { ...msg, content: response.message } : msg
            ));
        }

    } catch (err) {
        console.error(err);
        setMessages(prev => prev.map(msg => 
            msg.id === loadingId ? { ...msg, content: "Error connecting to AI." } : msg
        ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed bottom-6 ${alignment === 'left' ? 'left-6' : 'right-6'} z-50 flex flex-col items-end gap-4 ${themeClass} ${fontClass}`}>
      
      {/* 1. THE CHAT WINDOW (Conditionally Rendered with basic animation logic) */}
      <div 
        className={cn(`
          w-[380px] h-[80vh] max-h-[550px] bg-background dark:bg-background rounded-theme  
          flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 bottom-20' : 'opacity-0  translate-y-0 pointer-events-none absolute bottom-20'}
          
        `,
        appliedTheme === 'brutalist' && `border-4 border-border `
        ,

    )}
      >
        {/* Header */}
        <div 
            className="p-4 flex items-center justify-between  bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark"
        >
          <div className="flex items-center gap-2">
            <Icons.Bot />
            <div className="flex flex-col">
                <span className="font-semibold text-sm">{aiName}</span>
                {/* 🧠 Proving context works: showing current route */}
                <span className="text-[10px] opacity-80 uppercase tracking-wider">
                   {state.route.path === '/' ? 'Home' : state.route.path.replace('/', '')}
                </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <Icons.X />
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
          {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                    max-w-[85%] rounded-theme px-4 py-2.5 text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                        ? 'bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark rounded-br-none' 
                        : 'bg-surface dark:bg-surface-dark rounded-bl-none'
                    }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}
          
          {/* Debug Info (Optional - Good for dev) */}
          {messages.length === 1 && state.activeComponents.size > 0 && (
             <div className="text-xs text-center text-zinc-400 mt-4">
                ⚡ {state.activeComponents.size} tools active on this page
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark">
          <div className="flex items-end gap-2 bg-foreground/5 dark:bg-foreground-dark/5 p-2 rounded-xl focus-within:ring-2 ring-offset-1 focus-within:ring-blue-500/20 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to do something..."
              className="w-full  border-none focus:ring-0 text-sm p-1.5 min-h-10 max-h-[120px] resize-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-2 rounded-lg text-primary dark:text-primary-dark-mode disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110 active:scale-95"
        
            >
              <Icons.Send />
            </button>
          </div>
          <div className="text-[10px] text-zinc-400 text-center mt-2">
            AI can make mistakes. Check important info.
          </div>
        </div>
      </div>

      {/* 2. THE FLOATING TRIGGER BUTTON */}
      <Button
      size='small'
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center bg-primary text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95 z-50"
      >
        {isOpen ? <Icons.X /> : <Icons.Sparkles />}
      </Button>
    </div>
  );
};