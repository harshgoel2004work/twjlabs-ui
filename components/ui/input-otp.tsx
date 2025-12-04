"use client"

import React from 'react'
import type { TWJComponentsProps } from '@/twj-lib/types';
import { useTheme } from '@/contexts/ui-theme-context';
import OtpInput from 'react-otp-input';
import Input from './input';

interface OTPInputProps extends TWJComponentsProps {
  className?: string;
    inputNumber?: number;
    value?: string;
    onChange?: (otp: string) => void;
}

//BUILD ON TOP OF react-otp-input LIBRARY by devfolioco

const OTPInput = ({ theme, className, inputNumber = 4, value, onChange }: OTPInputProps) => {
  const [otp, setOtp] = React.useState('');
  const { theme: contextTheme } = useTheme();
  
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const activeTheme = theme || contextTheme || "modern";
  const appliedTheme = mounted ? activeTheme : "modern";

  return (
    <div className={className}>
      <OtpInput
        value={value || otp}
        onChange={onChange || setOtp}
        
        numInputs={inputNumber}
        renderSeparator={<span className="mx-1"></span>}
        // The renderInput receives props (including the ref) 
        // which are now correctly passed to your Input component
        renderInput={(props) => (
          <Input 
            {...props} 
            theme={appliedTheme} 
            className='text-center font-semibold'
            // Override the default inline width from the library if needed
            style={{ width: "2.5rem" }} 
          />
        )}
      />
    </div>
  )
}

export default OTPInput