import BackgroundSection from 'frontend/src/components/BackgroundSection'
import BgGlassmorphism from 'frontend/src/components/BgGlassmorphism'
import CarCardH from 'frontend/src/components/CarCardH'
import HeroSectionWithSearchForm1 from 'frontend/src/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from 'frontend/src/components/HeroSearchForm/HeroSearchForm'
import SectionClientSay from 'frontend/src/components/SectionClientSay'
import SectionDowloadApp from 'frontend/src/components/SectionDowloadApp'
import SectionOurFeatures from 'frontend/src/components/SectionOurFeatures'
import SectionSliderNewCategories from 'frontend/src/components/SectionSliderNewCategories'
import SectionVideos from 'frontend/src/components/SectionVideos'
import { getCarCategories } from 'frontend/src/data/categories'
import { getCarListings } from 'frontend/src/data/listings'
import heroImage from '@/images/hero-right-car.png'
import ourFeatureImage from '@/images/our-features-2.png'
import ButtonPrimary from 'frontend/src/shared/ButtonPrimary'
import HeadingWithSub from 'frontend/src/shared/Heading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Car - Home',
  description: 'Explore the best car rentals and experiences around the world.',
}

async function PageHome() {
  const categories = await getCarCategories()
  const carListings = await getCarListings()

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <HeroSectionWithSearchForm1
          heading="Find rides."
          image={heroImage}
          imageAlt="hero"
          searchForm={<HeroSearchForm initTab="Cars" />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                Discover of car rentals tailored to your needs.
              </p>
              <ButtonPrimary href={'/car-categories/all'} className="sm:text-base/normal">
                Start your search
              </ButtonPrimary>
            </>
          }
        />

        <div>
          <HeadingWithSub subheading="Explore the best cars and experiences around the world">
            Find your perfect cars
          </HeadingWithSub>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categoryCardType="card4"
            categories={categories}
          />
        </div>

        <div className="relative py-16">
          <BackgroundSection />
          <HeadingWithSub isCenter subheading={'Discover great cars near where you live'}>
            The best car rentals
          </HeadingWithSub>
          <div className="grid grid-cols-1 gap-x-6 gap-y-7 xl:grid-cols-2">
            {carListings.map((listing) => (
              <CarCardH key={listing.id} data={listing} />
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <ButtonPrimary href={'/car-listings'} className="sm:text-base/normal">
              View all car rentals
            </ButtonPrimary>
          </div>
        </div>

        <SectionOurFeatures type="type2" rightImg={ourFeatureImage} />

        <div>
          <HeadingWithSub subheading="Explore houses based on 10 types of stays">
            Explore by types of stays.
          </HeadingWithSub>
          <SectionSliderNewCategories categories={categories} categoryCardType="card5" />
        </div>

        <SectionDowloadApp />

        <SectionVideos />
        <div className="relative py-16">
          <SectionClientSay />
        </div>
      </div>
    </main>
  )
}

export default PageHome
