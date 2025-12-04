import React from 'react';
import { Check, X, ArrowRight, Zap } from 'lucide-react';
import Heading from './ui/basic/heading'; // Assuming these exist based on snippet
import Text from './ui/basic/text';       // Assuming these exist based on snippet
import { Button } from './ui/button';
import { Theme } from '@/twj-lib/types';

// Import your custom Card system
import { Card, CardBody, CardFooter, CardHeader } from './ui/card'; // Adjust path as needed

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for personal projects and learning.",
    features: [
      "All Open Source Components",
      "10+ Pre-built Sections",
      "MIT License",
      "Community Support",
      "Basic Documentation"
    ],
    notIncluded: ["Figma Design Files", "Priority Support", "Custom Development"],
    cta: "Start Building",
    featured: false
  },
  {
    name: "Pro Bundle",
    price: "$99",
    period: "/one-time",
    description: "For professional developers shipping production apps.",
    features: [
      "Everything in Starter",
      "Full Figma Design System",
      "Advanced Layout Templates",
      "Lifetime Updates",
      "Priority Email Support"
    ],
    notIncluded: ["Custom Development"],
    cta: "Get Pro Access",
    featured: true
  },
  {
    name: "The Walking Jumbo",
    price: "Custom",
    description: "We design and build your entire custom website.",
    features: [
      "Full Custom Design & Dev",
      "Strategy & SEO Optimization",
      "Performance Guarantee",
      "Dedicated Project Manager",
      "Ongoing Maintenance"
    ],
    notIncluded: [],
    cta: "Book a Call",
    featured: false,
    isAgency: true
  }
];

interface PricingSectionProps {
  theme?: Theme;
}

export default function PricingSection({ theme = 'modern' }: PricingSectionProps) {
  return (
    <section className="py-24 bg-background dark:bg-background-dark relative" id="pricing">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heading level={1} className='leading-tight text-foreground dark:text-foreground-dark'>
            Simple pricing, <span className="text-primary dark:text-primary-dark-mode">powerful results.</span>
          </Heading>
          
          <Text className="text-muted-foreground dark:text-muted-foreground-dark text-base mt-4">
            Start for free, upgrade for tools, or hire us to build it for you.
          </Text>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              theme={theme}
              className={`
                relative flex flex-col h-full
                ${plan.featured 
                  ? 'border-primary dark:border-primary-dark-mode shadow-2xl shadow-primary/10 scale-105 z-10' 
                  : plan.isAgency 
                    ? 'hover:border-neutral-400 dark:hover:border-neutral-600'
                    : 'hover:border-neutral-400 dark:hover:border-neutral-600'
                }
                ${plan.isAgency ? 'bg-surface dark:bg-surface-dark' : ''}
              `}
            >
              <CardHeader 
                title={plan.name}
                description={plan.description}
                className={plan.isAgency ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600" : ""}
              >
                {/* Price Display injected as children into CardHeader */}
                <div className="flex items-baseline gap-1 mt-2 mb-2">
                  <span className={`text-4xl font-bold ${plan.isAgency ? 'text-foreground dark:text-foreground-dark' : 'text-card-foreground dark:text-card-foreground-dark'}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground dark:text-muted-foreground-dark text-sm">
                      {plan.period}
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardBody className="flex-1 space-y-4">
                {/* Included Features */}
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 rounded-full p-0.5 shrink-0 
                      ${plan.isAgency 
                        ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400' 
                        : 'bg-primary/10 text-primary dark:text-primary-dark-mode'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-muted-foreground dark:text-muted-foreground-dark">
                      {feature}
                    </span>
                  </div>
                ))}

                {/* Not Included Features */}
                {plan.notIncluded && plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground/50 dark:text-muted-foreground-dark/50">
                    <X className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </CardBody>

              <CardFooter className={theme === 'brutalist' ? "border-t-2 border-black dark:border-white pt-6" : ""}>
                <Button 
                  theme={theme}
                  variant={plan.featured ? 'primary' : plan.isAgency ? 'outline' : 'secondary'}
                  className={`
                    w-full flex items-center justify-center gap-2
                    ${plan.featured ? 'shadow-lg shadow-primary/20' : ''}
                  `}
                >
                  {plan.cta}
                  {plan.isAgency && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </CardFooter>

            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}