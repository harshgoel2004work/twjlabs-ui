import React from 'react';
import { ArrowRight, Sparkles, MoveRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardBody } from './ui/card';

export default function AgencyCTA() {
  return (
    <section className="relative w-full py-24 bg-background dark:bg-background-dark overflow-hidden font-theme">
        
      {/* Visual Separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent" />

     <Card className='max-w-7xl mx-auto'>
        <CardBody className='grid grid-cols-2 gap-12 items-center p-8 md:p-8 relative z-10'>
                
               
                <div className="flex flex-col items-start text-left">
                    
                    <Badge prefix={<Sparkles className="w-3 h-3" />} label='Built by the experts' className='' variant='primary'/>

                     <h2 className="text-3xl md:text-5xl font-bold leading-tight  mb-6 mt-6">
                        Need a custom website <br/>
                        <span className="text-transparent bg-clip-text bg-primary dark:bg-accent-foreground-dark">
                            built by pros?
                        </span>
                    </h2>

                     <p className="text-neutral-400 text-lg mb-8 leading-relaxed max-w-lg">
                        This library is powered by <strong>The Walking Jumbo</strong>, a premium web development agency. 
                        We don't just sell components; we build award-winning digital experiences using this exact stack.
                    </p>

                     <div className="flex flex-wrap gap-4">
                        <Button className="group relative ">
                            <span className="relative z-10 flex items-center gap-2">
                                Hire The Walking Jumbo 
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Button>
                        <Button variant='outline' className="px-8 py-4 bg-transparent border border-neutral-700  font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                            View Portfolio
                        </Button>
                    </div>



                </div>

                {/* Right Visual / "Jumbo" abstract representation */}
                <div className="relative h-full min-h-[300px] flex items-center justify-center col-span-1">
                    {/* Abstract "Walking Jumbo" representation using UI cards */}
                    <div className="relative w-full max-w-sm aspect-square">
                        
                        
                        <Card className='absolute inset-4  p-6 shadow-2xl flex flex-col justify-between -rotate-3 hover:rotate-0 transition-transform duration-500'>
                            <CardBody className='flex flex-col justify-between h-full'>
                                <div className="space-y-4">
                                <div className="h-8 w-8 rounded-full bg-indigo-500" />
                                <div className="h-4 w-2/3 bg-neutral-400 dark:bg-neutral-800 rounded" />
                                <div className="h-4 w-1/2 bg-neutral-400 dark:bg-neutral-800 rounded" />
                           </div>
                           <div className="p-4 rounded-theme bg-neutral-200 dark:bg-neutral-800/50 border border-neutral-700/50">
                                <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300">
                                    <span>Performance</span>
                                    <span className="text-green-400 font-mono">100%</span>
                                </div>
                                <div className="mt-2 h-1 w-full bg-neutral-700 rounded-full overflow-hidden">
                                    <div className="h-full w-full bg-green-500" />
                                </div>
                           </div>
                            </CardBody>
                        </Card>

                       
                        <Badge className='absolute -top-4 -right-4 p-2 shadow-xl flex items-center gap-2 animate-bounce-slow' prefix={<div className="w-3 h-3 bg-primary rounded-full animate-pulse" />} label='Open for Projects' variant='secondary'/>
                        
                    </div>
                </div>
          
        </CardBody>
     </Card>
        
            
            {/* Background Effects */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-900/0 to-neutral-900/0" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" /> */}

           
        


    </section>
  );
}