
import React from 'react';
import { cn } from '@/twj-lib/tw';
import type { Theme } from '@/twj-lib/types';
import { Button } from '@/components/ui/button'; 
import { fontApplier } from '@/twj-lib/font-applier'; 

// --- Shared Types ---
interface HeroAction {
    label: string;
    onClick?: () => void;
}

export interface SharedHeroProps {
    heading: string;
    subheading: string;
    cta1?: HeroAction;
    cta2?: HeroAction;
    image?: string;
    theme?: Theme;
    className?: string;
}

export const HeroOne = ({
    heading,
    subheading,
    cta1,
    cta2,
    image,
    theme = 'modern',
    className
}: SharedHeroProps) => {
    
    const themeClass = `theme-${theme}`;
    const styles = getHeroStyles(theme);
    const hasImage = !!image;

    return (
        <section
            className={cn(
                themeClass,
                fontApplier(theme),
                "relative w-full overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32",
                styles.container,
                className
            )}
        >
            {/* Background Decorators */}
            {theme === 'modern' && (
                <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-bl from-primary/5 to-transparent blur-3xl" />
            )}
            {theme === 'futuristic' && (
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className={cn(
                    "flex flex-col lg:flex-row items-center gap-12",
                    !hasImage && "text-center justify-center"
                )}>
                    {/* Content */}
                    <div className={cn("flex-1 space-y-8", !hasImage && "max-w-3xl mx-auto")}>
                        <h1 className={cn("text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight", styles.heading)}>
                            {heading}
                        </h1>
                        <p className={cn("text-lg sm:text-xl max-w-2xl", styles.subheading)}>
                            {subheading}
                        </p>
                        <div className={cn("flex flex-wrap gap-4", !hasImage && "justify-center")}>
                            {cta1 && (
                                <Button label={cta1.label} onClick={cta1.onClick} theme={theme} variant="primary" size="large" className="w-full sm:w-auto shadow-xl" />
                            )}
                            {cta2 && (
                                <Button label={cta2.label} onClick={cta2.onClick} theme={theme} variant={theme === 'brutalist' ? 'secondary' : 'outline'} size="large" className="w-full sm:w-auto" />
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    {hasImage && (
                        <div className="flex-1 w-full relative">
                            <div className={cn("relative rounded-theme overflow-hidden", styles.imageWrapper)}>
                                <img src={image} alt="Hero Visual" className="w-full h-auto object-cover relative z-10" />
                                {theme === 'futuristic' && <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 transform scale-90" />}
                                {theme === 'brutalist' && <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 -z-10" />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
