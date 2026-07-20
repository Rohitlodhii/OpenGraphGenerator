"use client"
import LeftPanel from '../leftpanel/LeftPanel'
import MobileToolbar from '../leftpanel/MobileToolbar'
import Navbar from '../leftpanel/Navbar'
import LayersSidebar from '../leftpanel/LayersSidebar'
import { SidebarProvider } from '../ui/sidebar'
import Previewer from './Previewer'
import { useIsMobile } from '@/hooks/use-mobile'
import { useHistoryManager } from '@/hooks/use-history'
import { useHistoryShortcuts } from '@/hooks/use-history-shortcuts'

const Workspace = () => {
  const isMobile = useIsMobile()
  useHistoryManager()
  useHistoryShortcuts()

  return (
    <SidebarProvider>
      <div className='w-full h-screen flex flex-col gap-0'>
        {/* Top navbar - full width */}
        <Navbar />

        <div className='flex-1 min-h-0 w-full flex flex-col md:flex-row gap-0'>
          {/* Left Section - desktop only */}
          <section className='hidden md:block w-[26%] lg:w-[24%] h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-hidden'>
            <LeftPanel />
          </section>

          {/* Middle Section - fills remaining width on desktop, full width on mobile */}
          <section className='relative w-full md:w-[74%] lg:w-[76%] h-full text-foreground overflow-hidden'>
            <div className='h-full w-full overflow-auto'>
              <Previewer />
            </div>
            <LayersSidebar />

            {/* Mobile bottom menu + non-blocking bottom sheet */}
            {isMobile && <MobileToolbar />}
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Workspace
