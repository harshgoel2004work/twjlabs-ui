"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { useTheme } from 'next-themes'
import Input from '../ui/input'

const AIHelperDemo = () => {
  const {theme,setTheme} = useTheme()
  return (
    <div className='border p-4 rounded-theme flex flex-wrap justify-center items-center gap-12 '>
        <Button aiID="say-hello" aiDescription="A button that says Hello" onClick={() => alert('Hello!')}>Say Hello</Button>
        <Switch 
          label="Dark Mode"
          checked={theme === 'dark'}
          onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          // 🧠 AI Wiring
          aiID="dark-mode"
          aiDescription="Toggles dark mode. When on, the application uses a dark color scheme. Or sets light mode by turning off dark mode."
        />

        <Input type='email' aiID='email' aiDescription="Input field for email address" placeholder='email address' className='w-56'/>
    </div>
  )
}

export default AIHelperDemo