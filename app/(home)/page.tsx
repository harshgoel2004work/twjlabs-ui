import AgencyCTA from '@/components/agency-cta';
import FeaturesSection from '@/components/features';
import HeroSectionDynamic from '@/components/hero-dynamic';


export default function HomePage() {


  return (
    <div>
      {/* <HeroSection /> */}
      <HeroSectionDynamic />
      
      <FeaturesSection />
      <AgencyCTA />
    </div>
  );
}
