// Define available themes strongly typed
export type Theme = 'modern' | 'elegant' | 'futuristic' | 'playful' | 'brutalist' | 'organic' | 'minimalist' | 'vintage';

export const themes: Theme[] = ['modern', 'elegant', 'futuristic', 'playful', 'brutalist', 'organic', 'minimalist', 'vintage'];

export interface TWJComponentsProps {
    theme?: Theme;
}

export interface TWJAIComponentsProps extends TWJComponentsProps {
    aiID?: string;
    aiDescription?: string;
}