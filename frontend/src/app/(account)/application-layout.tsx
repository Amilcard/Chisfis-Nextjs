import Footer2 from 'frontend/src/components/Footer2'
import FooterQuickNavigation from 'frontend/src/components/FooterQuickNavigation'
import Header from 'frontend/src/components/Header/Header'
import HeroSearchFormMobile from 'frontend/src/components/HeroSearchFormMobile/HeroSearchFormMobile'
import Aside from 'frontend/src/components/aside'
import AsideSidebarNavigation from 'frontend/src/components/aside-sidebar-navigation'
import 'rc-slider/assets/index.css'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const ApplicationLayout: React.FC<Props> = ({ children }) => {
  return (
    <Aside.Provider>
      {/* Desktop Header - Will be hidden on mobile devices  */}
      <div className="hidden lg:block">
        <Header />
      </div>
      {/* HeroSearchFormMobile - will display on mobile devices instead of Header-desktop */}
      <div className="sticky top-0 z-10 container flex h-20 items-center justify-center bg-white lg:hidden dark:bg-neutral-900">
        <HeroSearchFormMobile />
      </div>
      {/*  */}
      {children}
      {/*  */}
      {/* FooterQuickNavigation - Displays on mobile devices and is fixed at the bottom of the screen */}
      <FooterQuickNavigation />
      {/* Chose footer style here!!!! */}
      <Footer2 /> {/* <Footer /> or <Footer3 /> or <Footer4 />*/}
      {/*  */}
      <AsideSidebarNavigation />
    </Aside.Provider>
  )
}

export { ApplicationLayout }
