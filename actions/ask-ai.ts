"use server";

import { 
  GoogleGenerativeAI, 
  SchemaType, 
  FunctionCallingMode, 
  Tool,
  Content // Import Content type
} from "@google/generative-ai";
import { AIContextState } from '@/contexts/ai-context'; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the Message type here or import it if you have it in a shared types file
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  message: string;
  toolCall?: {
    componentId: string;
    actionName: string;
    actionValue?: string;
  };
}

export async function askAI(
  userMessage: string, 
  contextState: AIContextState,
  history: AIMessage[] = [] // 🆕 Accept History
): Promise<AIResponse> {
  try {
    // 1. Prepare Tools Context
    const toolsContext = Array.from(contextState.activeComponents.values()).map(comp => ({
      id: comp.id,
      description: comp.description,
      actions: comp.availableActions
    }));

    // 2. Define Tools
    const tools = [{
      functionDeclarations: [{
        name: "trigger_component",
        description: "Triggers an action on a specific UI component based on its ID.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            componentId: { type: SchemaType.STRING, description: "The ID of the component" },
            actionName: { type: SchemaType.STRING, description: "The action to perform" },
            actionValue: { type: SchemaType.STRING, description: "Value if provided for an action" }
          },
          required: ["componentId", "actionName"]
        }
      }]
    }];

    // 3. 🆕 Format History for Gemini
    // Gemini expects roles to be 'user' or 'model'
    let formattedHistory: Content[] = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // 🚨 THE FIX: Sanitize History
    // Gemini crashes if history starts with 'model'. 
    // We remove the first item if it is not from 'user'.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
        formattedHistory.shift(); 
    }

    // 4. Initialize Model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      tools: tools as Tool[],
      toolConfig: { functionCallingConfig: { mode: FunctionCallingMode.AUTO } },
      systemInstruction: `
        You are an intelligent interface assistant.
        
        === YOUR PERSONA ===
        ${contextState.assistantPersona === 'sales_rep' 
            ? 'You are a charismatic Sales Representative. Focus on upselling and benefits.' 
            : 'You are a helpful, technical Guide. Focus on clarity and accuracy.'}

        === KNOWLEDGE BASE ===
        ${contextState.knowledgeBase || "No specific knowledge base provided."}

        === CURRENT CONTEXT ===
        - Route: ${contextState.route.path}
        - Visible Screen Text: "${contextState.pageContent.rawText.slice(0, 10000)}..."
        
        === AVAILABLE TOOLS ===
        ${JSON.stringify(toolsContext, null, 2)}
        
        === INSTRUCTIONS ===
        1. CHECK TOOLS FIRST: If the user request matches a tool, CALL "trigger_component".
        2. CHECK KNOWLEDGE BASE.
        3. CHECK SCREEN TEXT.
        4. Be concise.
      `
    });

    // 5. Start Chat with History
    const chat = model.startChat({
      history: formattedHistory
    });

    // 6. Send the NEW message
    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    
    // 7. Check for Function Calls
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "trigger_component") {
        const args = call.args as any; 
        return {
          message: `Executing ${args.actionName} on ${args.componentId}...`,
          toolCall: {
            componentId: args.componentId,
            actionName: args.actionName,
            actionValue: args.actionValue // 🆕 Pass actionValue if provided
          }
        };
      }
    }

    return { message: response.text() };

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return { message: "Sorry, I had trouble connecting to Gemini." };
  }
}