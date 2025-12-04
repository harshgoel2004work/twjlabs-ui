import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import SearchDialog from '@/components/search';
import { Banner } from 'fumadocs-ui/components/banner';
import { ThemeProvider } from '@/contexts/ui-theme-context';

// 1. Import the fonts
import { 
  Manrope, 
  Lora, 
  Orbitron, 
  Fredoka, 
  Roboto_Condensed, 
  Nunito,
  Grenze_Gotisch
} from "next/font/google";
import { ModeThemeProvider } from '@/contexts/local-theme-provider';

// 2. Setup the font instances with specific variable names
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron", display: "swap" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka", display: "swap" });
const robotoCondensed = Roboto_Condensed({ subsets: ["latin"], variable: "--font-roboto-condensed", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const grenzeGotisch = Grenze_Gotisch({ subsets: ["latin"], variable: "--font-grenze-gotisch", display: "swap" });

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
   <ModeThemeProvider
   attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange>
    <ThemeProvider initialTheme='brutalist'>
      <html lang="en" className={`
          ${manrope.variable} 
            ${lora.variable} 
            ${orbitron.variable} 
            ${fredoka.variable} 
            ${robotoCondensed.variable} 
            ${nunito.variable}
            ${grenzeGotisch.variable}`
          } 
      suppressHydrationWarning>
        <body className="flex flex-col min-h-screen">
          <RootProvider theme={{enabled:false, defaultTheme:'dark', }}>
            <Banner
            className='text-xs '
    variant="rainbow"
    rainbowColors={[
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
      'rgba(47, 0, 255, 0.5)',
    ]}
    // id='announcement-banner'
  >
    v2.0 is here! New components and themes are coming soon! Stay tuned.
  </Banner>
            {children}
          </RootProvider>
        </body>
      </html>
   </ThemeProvider>
   </ModeThemeProvider>
  );
}
