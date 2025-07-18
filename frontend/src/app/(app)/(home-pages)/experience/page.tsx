import BackgroundSection from 'frontend/src/components/BackgroundSection'
import BgGlassmorphism from 'frontend/src/components/BgGlassmorphism'
import ExperiencesCard from 'frontend/src/components/ExperiencesCard'
import HeroSectionWithSearchForm1 from 'frontend/src/components/hero-sections/HeroSectionWithSearchForm1'
import HeroSearchForm from 'frontend/src/components/HeroSearchForm/HeroSearchForm'
import SectionClientSay from 'frontend/src/components/SectionClientSay'
import SectionGridAuthorBox from 'frontend/src/components/SectionGridAuthorBox'
import SectionGridCategoryBox from 'frontend/src/components/SectionGridCategoryBox'
import SectionHowItWork from 'frontend/src/components/SectionHowItWork'
import SectionSliderNewCategories from 'frontend/src/components/SectionSliderNewCategories'
import SectionSubscribe2 from 'frontend/src/components/SectionSubscribe2'
import { getAuthors } from 'frontend/src/data/authors'
import { getExperienceCategories } from 'frontend/src/data/categories'
import { getExperienceListings } from 'frontend/src/data/listings'
import heroImage from '@/images/hero-right-experience.png'
import ButtonPrimary from 'frontend/src/shared/ButtonPrimary'
import { Divider } from 'frontend/src/shared/divider'
import HeadingWithSub from 'frontend/src/shared/Heading'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experiences Home',
  description: 'Home page of the Experiences application',
}

async function Home() {
  const categories = await getExperienceCategories()
  const experienceListings = await getExperienceListings()
  const authors = await getAuthors()

  return (
    <main className="relative overflow-hidden">
      <BgGlassmorphism />
      <div className="relative container mb-24 flex flex-col gap-y-24 lg:mb-28 lg:gap-y-32">
        <HeroSectionWithSearchForm1
          heading="Discover Adventures"
          image={heroImage}
          imageAlt="hero"
          searchForm={<HeroSearchForm initTab="Experiences" />}
          description={
            <>
              <p className="max-w-xl text-base text-neutral-500 sm:text-xl dark:text-neutral-400">
                With us, your trip is filled with amazing experiences.
              </p>
              <ButtonPrimary href={'/experience-categories/all'} className="sm:text-base/normal">
                Start your search
              </ButtonPrimary>
            </>
          }
        />

        <div>
          <HeadingWithSub subheading="Keep calm & travel on">Let's go on an adventure</HeadingWithSub>
          <SectionSliderNewCategories
            itemClassName="w-[17rem] lg:w-1/3 xl:w-1/4"
            categories={categories}
            categoryCardType="card5"
          />
        </div>

        <div className="relative py-20">
          <BackgroundSection />
          <HeadingWithSub isCenter subheading="Find the perfect experience for you.">
            Experience listings
          </HeadingWithSub>
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:mt-10 lg:grid-cols-3 xl:grid-cols-4">
            {experienceListings.map((listing) => (
              <ExperiencesCard key={listing.id} data={listing} />
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <ButtonPrimary href="/experience-categories/all">
              <span>Show all experiences</span>
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={20}
                color="currentColor"
                strokeWidth={1.5}
                className="rtl:rotate-180"
              />
            </ButtonPrimary>
          </div>
        </div>

        <SectionHowItWork />

        <div className="relative py-20">
          <BackgroundSection />
          <HeadingWithSub isCenter subheading="Meet the best our authors.">
            Become a host
          </HeadingWithSub>
          <SectionGridAuthorBox authors={authors} />
        </div>

        <div>
          <HeadingWithSub isCenter subheading={'Keep calm & travel on'}>
            Explore nearby
          </HeadingWithSub>
          <SectionGridCategoryBox categories={categories} />
        </div>

        <SectionSubscribe2 />
        <Divider />

        <div className="relative py-10">
          <SectionClientSay />
        </div>
      </div>
    </main>
  )
}

export default Home
