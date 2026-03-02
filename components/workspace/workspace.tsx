"use client"
import RightPanel from '../rightpanel/RightPanel'
import Previewer from './Previewer'

const Workspace = () => {
  return (
    <div className='w-full h-screen flex flex-col md:flex-row gap-0'>
      {/* Left Section - 20% on desktop, fixed navbar on mobile */}
      <section className='sticky top-0 w-full md:w-[20%] h-16 md:h-full md:sticky md:top-0 bg-sidebar text-sidebar-foreground border-b md:border-b-0 md:border-r border-sidebar-border overflow-x-auto md:overflow-y-auto z-10 md:z-0'>
        {/* Left content goes here */}
      </section>

      {/* Middle Section - 60% on desktop, full width on mobile */}
      <section className='w-full md:w-[60%] h-1/2 md:h-full overflow-auto bg-background text-foreground'>
        <Previewer />
      </section>

      {/* Right Section - 20% on desktop, full width on mobile below */}
      <section className='w-full md:w-[20%] h-1/2 md:h-full bg-popover text-popover-foreground border-t md:border-t-0 md:border-l border-popover-foreground/10 overflow-y-auto'>
        <RightPanel/>
      </section>
    </div>
  )
}

export default Workspace
