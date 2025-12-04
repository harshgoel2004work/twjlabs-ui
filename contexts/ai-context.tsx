"use client"

import { TWJComponentsProps } from "@/twj-lib/types";
// AIContextProvider.tsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

// 2. The definition of a component tool
export type AIAction = (...args: any[]) => Promise<void> | void;

export interface AIRegisteredComponent {
  id: string;
  description: string;
  // We store the actual functions here, but we won't send this object to the AI directly
  actions: Record<string, AIAction>; 
}

// 3. YOUR INTERFACE (The State) - This is what we feed the LLM
export interface AIContextState extends TWJComponentsProps {
  route: {
    path: string;
    params?: Record<string, string>; // Made optional for flexibility
  };

  pageContent: {
    rawText: string;
    lastUpdated: number;
  };

  // We only expose the NAMES of actions to the state to keep it clean/serializable
  activeComponents: Map<string, {
    id: string;
    description: string;
    availableActions: string[]; 
  }>;

  assistantPersona: 'helpful_guide' | 'technical_debugger' | 'sales_rep';

  knowledgeBase?: string;
}

// 4. The Context Value (State + Methods)
export interface AIContextValue {
  state: AIContextState;
  
  // Methods to control the system
  registerComponent: (comp: AIRegisteredComponent) => void;
  unregisterComponent: (id: string) => void;
  executeAction: (componentId: string, actionName: string, actionValue?:any) => Promise<void>;
  setPersona: (persona: AIContextState['assistantPersona']) => void;
}

const AIContext = createContext<AIContextValue | null>(null);

interface AIProviderProps extends TWJComponentsProps {
  children: React.ReactNode;
  currentPath?: string; 
  initialPersona?: AIContextState['assistantPersona'];

  knowledgeBase?: string;
}

export const AIContextProvider: React.FC<AIProviderProps> = ({ 
  children, 
  currentPath = typeof window !== 'undefined' ? window.location.pathname : '/',
  initialPersona = 'helpful_guide',
  knowledgeBase='',
  ...rest // Capture TWJ props
}) => {
  
  // --- INTERNAL STATE (The Shadow Registry) ---
  // We use a Ref for the functions to avoid re-renders when actions technically change identity
  // but logically stay the same.
  const actionRegistry = useRef<Map<string, AIRegisteredComponent>>(new Map());

  // --- PUBLIC STATE (What the AI Sees) ---
  const [state, setState] = useState<AIContextState>({
    ...rest,
    route: { path: currentPath, params: {} },
    pageContent: { rawText: '', lastUpdated: Date.now() },
    activeComponents: new Map(),
    assistantPersona: initialPersona,
    knowledgeBase: knowledgeBase
  });

  // 1. AWARENESS: Register Components
  const registerComponent = useCallback((comp: AIRegisteredComponent) => {
    // A. Update the Shadow Registry (Logic)
    actionRegistry.current.set(comp.id, comp);

    // B. Update the Public State (Visibility)
    setState((prev) => {
      const newMap = new Map(prev.activeComponents);
      newMap.set(comp.id, {
        id: comp.id,
        description: comp.description,
        availableActions: Object.keys(comp.actions) // Only store strings!
      });
      return { ...prev, activeComponents: newMap };
    });
  }, []);

  const unregisterComponent = useCallback((id: string) => {
    actionRegistry.current.delete(id);
    setState((prev) => {
      const newMap = new Map(prev.activeComponents);
      newMap.delete(id);
      return { ...prev, activeComponents: newMap };
    });
  }, []);

  // 2. ACTION: The Executor
  const executeAction = useCallback(async (componentId: string, actionName: string, actionValue?:any) => {
    const comp = actionRegistry.current.get(componentId);
    
    if (!comp) {
      console.warn(`[AI] Component not found: ${componentId}`);
      return;
    }

    const action = comp.actions[actionName];
    if (action) {
      console.log(`[AI] Executing: ${componentId} > ${actionName} with value:`, actionValue);
      await action(actionValue);
    } else {
      console.warn(`[AI] Action '${actionName}' not found on ${componentId}`);
    }
  }, []);

  // 3. SIGHT: DOM Observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const scrapeDOM = () => {
      const idleCallback = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 1));
      idleCallback(() => {
        // Basic scraping strategy
        const text = document.body.innerText
          .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gm, "") // remove scripts
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 10000); // Limit context size for tokens

        setState(prev => {
            if (prev.pageContent.rawText === text) return prev;
            return {
                ...prev,
                pageContent: { rawText: text, lastUpdated: Date.now() }
            };
        });
      });
    };

    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(scrapeDOM, 1000); // 1s debounce
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    scrapeDOM();

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [state.route.path]); // Re-scrape when path changes

  // 4. ROUTE: Update state when prop changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      route: { ...prev.route, path: currentPath }
    }));
  }, [currentPath]);

  // 🆕 Update state if the prop changes dynamically (e.g. if you fetch docs)
  useEffect(() => {
    setState(prev => ({ ...prev, knowledgeBase }));
  }, [knowledgeBase]);

  const setPersona = (persona: AIContextState['assistantPersona']) => {
    setState(prev => ({ ...prev, assistantPersona: persona }));
  };

  return (
    <AIContext.Provider value={{ state, registerComponent, unregisterComponent, executeAction, setPersona }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAIContext must be used within AIContextProvider");
  return context;
};

// ============== HOOK ==============
//=======================================



interface UseAIControlProps {
  id: string;
  description: string;
  actions: Record<string, AIAction>;
}

export const useAIControl = ({ id, description, actions }: UseAIControlProps) => {
  const { registerComponent, unregisterComponent } = useAIContext();
  
  // Keep actions stable in a ref so we don't re-register constantly
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  useEffect(() => {
    registerComponent({
      id,
      description,
      actions: actionsRef.current,
    });

    return () => {
      unregisterComponent(id);
    };
  }, [id, description, registerComponent, unregisterComponent]);
};