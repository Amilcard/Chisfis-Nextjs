import { ApplicationLayout } from 'frontend/src/app/(app)/application-layout'
import Header3 from 'frontend/src/components/Header/Header3'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  return <ApplicationLayout header={<Header3 initSearchFormTab="RealEstates" />}>{children}</ApplicationLayout>
}

export default Layout
