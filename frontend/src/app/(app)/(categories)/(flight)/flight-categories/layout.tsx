import { ApplicationLayout } from 'frontend/src/app/(app)/application-layout'
import BackgroundSection from 'frontend/src/components/BackgroundSection'
import BgGlassmorphism from 'frontend/src/components/BgGlassmorphism'
import SectionGridAuthorBox from 'frontend/src/components/SectionGridAuthorBox'
import SectionSliderNewCategories from 'frontend/src/components/SectionSliderNewCategories'
import SectionSubscribe2 from 'frontend/src/components/SectionSubscribe2'
import { getAuthors } from 'frontend/src/data/authors'
import { getStayCategories } from 'frontend/src/data/categories'
import Heading from 'frontend/src/shared/Heading'
import { ReactNode } from 'react'

const Layout = async ({ children }: { children: ReactNode }) => {
  const categories = (await getStayCategories()).slice(7, 15)
  const authors = await getAuthors()

  return (
    <ApplicationLayout>
      <BgGlassmorphism />

      {children}

      <div className="container">
        <div className="relative py-16 lg:py-20">
          <BackgroundSection />
          <Heading subheading="Explore houses based on 10 types of stays">Explore the world with us.</Heading>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categories={categories}
            categoryCardType="card5"
          />
        </div>
        <SectionSubscribe2 className="py-24 lg:py-32" />
        <div className="relative mb-24 py-16 lg:mb-28 lg:py-20">
          <BackgroundSection />
          <Heading subheading="Meet our top 10 authors of the month" isCenter>
            Top 10 author of the month.
          </Heading>
          <SectionGridAuthorBox authors={authors} />
        </div>
      </div>
    </ApplicationLayout>
  )
}

export default Layout
