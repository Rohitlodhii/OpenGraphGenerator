"use client"
import LeftPanel from '../leftpanel/LeftPanel'
import Navbar from '../leftpanel/Navbar'
import RightPanel from '../rightpanel/RightPanel'
import { Sidebar, SidebarProvider } from '../ui/sidebar'
import Previewer from './Previewer'
import { useIsMobile } from '@/hooks/use-mobile'

const Workspace = () => {
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <div className='w-full h-screen flex flex-col gap-0'>
        {/* Top navbar - full width */}
        <Navbar showSidebarToggle={isMobile} />

        <div className='flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0'>
          {/* Left Section - desktop only */}
          <section className='hidden md:block w-[20%] h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden'>
            <LeftPanel />
          </section>

          {/* Mobile left sidebar */}
          {isMobile && (
            <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
              <LeftPanel />
            </Sidebar>
          )}

          {/* Middle Section - 60% on desktop, full width on mobile */}
          <section className='w-full md:w-[60%] h-1/2 md:h-full overflow-auto text-foreground'>
            <Previewer />
          </section>

          {/* Right Section - 20% on desktop, full width on mobile below */}
          <section className='w-full md:w-[20%] h-1/2 md:h-full bg-popover text-popover-foreground border-t md:border-t-0 md:border-l border-popover-foreground/10 overflow-hidden'>
            <RightPanel />
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Workspace
