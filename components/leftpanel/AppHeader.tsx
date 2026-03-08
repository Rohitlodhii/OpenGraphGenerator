import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'

type AppHeaderProps = {
  showSidebarToggle?: boolean
}

const AppHeader = ({ showSidebarToggle = false }: AppHeaderProps) => {
  return (      
    <div className='w-full h-14 p-2 border border-border flex items-center justify-between rounded-2xl'>
        <div className=' flex gap-2 items-center justify-center'>
            <div className='h-10 w-10 aspect-square rounded-xl bg-amber-700'></div>
            <div className='font-mono'>  OPENGG</div>
        </div>
   
        <div>{showSidebarToggle ? <SidebarTrigger aria-label="Toggle left sidebar" /> : null}</div>
    </div>
  )
}

export default AppHeader
