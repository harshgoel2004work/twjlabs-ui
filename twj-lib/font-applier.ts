import type { Theme } from "./types"

export const fontApplier = (theme: Theme) => {
    
    switch(theme){
        case 'modern':
            return 'font-modern'
        case 'futuristic':
            return 'font-futuristic'
        case 'brutalist':
            return 'font-brutalist'
        case 'minimalist':
            return 'font-minimalist'
        case 'elegant':
            return 'font-elegant'
        case 'playful':
            return 'font-playful'
        case 'organic':
            return 'font-organic'
        case 'vintage':
            return 'font-vintage'
        // Add more cases if you want to create new custom theme

        default:
            return 'font-default' // Fallback font
    }
}

