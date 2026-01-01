"use client"

import React from "react";
import { cn } from "@/twj-lib/tw";
import Image, { ImageProps as NextImageProps } from "next/image";
import { useTheme } from "@/contexts/ui-theme-context";
import { TWJComponentsProps } from "@/twj-lib/types";
import { fontApplier } from "@/twj-lib/font-applier";

interface ImageProps extends TWJComponentsProps {
  src: string;
  description?: string;
  padding?: string;
  className?: string;
  boxWidth?: string;   // e.g. "200px" or "100%"
  boxHeight?: string;  // optional
  aspectRatio?: "square" | "landscape" | "portrait";
}

const ImageContainer = ({
  src,
  description,
  padding: boxPadding = "0px",
  className,
  aspectRatio = "square",
  boxWidth = "400px",
  boxHeight,
  theme,
  alt,
  ...props
}: ImageProps & NextImageProps) => {
 // Get theme from UI context
   const { theme: contextTheme } = useTheme();
 
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
    

  return (
    <div
    style={{ width: boxWidth, ...(boxHeight ? { height: boxHeight } : {}), padding: boxPadding }}
  className={cn(
    themeClass,
    fontClass,
    "overflow-hidden rounded-theme border border-border dark:border-border-dark bg-surface",
    appliedTheme === "brutalist" && "border-2 border-border dark:border-border-dark/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]/20 font-brutalist",
    className
  )}
  
>
 <div className={cn(
    "relative",
        aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "landscape"
      ? "aspect-video"
      : "aspect-3/4",
 )} >
     <Image
        src={src}
        alt={alt ?? description ?? "Image"}
        fill
        className="object-cover rounded-theme"
        sizes="(max-width: 640px) 100vw, 640px"
        {...props}
      />
 </div>

      <div>
        {description && (
            <div className={cn('p-2 text-foreground dark:text-foreground-dark text-xs font-medium  w-full')}>
                {description} 
            </div>
        )}
      </div>
</div>
  );
};

export default ImageContainer;
