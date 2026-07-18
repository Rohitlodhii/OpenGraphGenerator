"use client"
import LeftPanel from '../leftpanel/LeftPanel'
import Navbar from '../leftpanel/Navbar'
import LayersSidebar from '../leftpanel/LayersSidebar'
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
          <section className='hidden md:block w-[26%] lg:w-[24%] h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden'>
            <LeftPanel />
          </section>

          {/* Mobile left sidebar */}
          {isMobile && (
            <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
              <LeftPanel />
            </Sidebar>
          )}

          {/* Middle Section - fills remaining width on desktop, full width on mobile */}
          <section className='relative w-full md:w-[74%] lg:w-[76%] h-full text-foreground'>
            <div className='h-full w-full overflow-auto'>
              <Previewer />
            </div>
            <LayersSidebar />
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Workspace
