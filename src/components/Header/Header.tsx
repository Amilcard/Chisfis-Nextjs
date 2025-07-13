'use client'

import { getStayCategories } from '@/data/categories'
import { getCurrencies, getLanguages, getNavMegaMenu } from '@/data/navigation'
import { Button } from '@/shared/Button'
import Logo from '@/shared/Logo'
import clsx from 'clsx'
import { FC, useState, useEffect } from 'react'
import AvatarDropdown from './AvatarDropdown'
import CategoriesDropdown from './CategoriesDropdown'
import CurrLangDropdown from './CurrLangDropdown'
import HamburgerBtnMenu from './HamburgerBtnMenu'
import MegaMenuPopover from './MegaMenuPopover'
import NotifyDropdown from './NotifyDropdown'
import FilterPopover from '../HeroSearchForm/FilterPopover'
interface HeaderProps {
  hasBorderBottom?: boolean
  className?: string
}

const Header: FC<HeaderProps> = ({ hasBorderBottom = true, className }) => {
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [megamenu, setMegamenu] = useState<any>(null)
  const [currencies, setCurrencies] = useState<any>(null)
  const [languages, setLanguages] = useState<any>(null)
  const [featuredCategory, setFeaturedCategory] = useState<any>(null)

  // États pour les filtres avancés
  const [date, setDate] = useState('Toute date')
  const [age, setAge] = useState('Tous âges')
  const [activity, setActivity] = useState('Toutes activités')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400])

  const handleApplyFilters = () => {
    setFiltersOpen(false)
    console.log('Filtres appliqués:', { date, age, activity, priceRange })
    // Ici vous pouvez ajouter la logique de recherche
  }

  useEffect(() => {
    const loadData = async () => {
      const [megamenuData, currenciesData, languagesData, categoriesData] = await Promise.all([
        getNavMegaMenu(),
        getCurrencies(),
        getLanguages(),
        getStayCategories()
      ])
      setMegamenu(megamenuData)
      setCurrencies(currenciesData)
      setLanguages(languagesData)
      setFeaturedCategory(categoriesData[7])
    }
    loadData()
  }, [])

  if (!megamenu || !currencies || !languages || !featuredCategory) {
    return <div className="h-20 animate-pulse bg-gray-100"></div>
  }

  return (
    <div className={clsx('relative', className)}>
      <div className="container">
        <div
          className={clsx(
            'flex h-20 justify-between gap-x-2.5 border-neutral-200 dark:border-neutral-700',
            hasBorderBottom && 'border-b',
            !hasBorderBottom && 'has-[.header-popover-full-panel]:border-b'
          )}
        >
          <div className="flex items-center justify-center gap-x-3 sm:gap-x-8">
            <Logo />
            <div className="hidden h-7 border-l border-neutral-200 md:block dark:border-neutral-700"></div>
            <div className="hidden md:block">
              <CategoriesDropdown />
            </div>
          </div>

          {/* Barre de recherche arrondie étendue avec FilterPopover intégré */}
          <div className="relative flex-1 max-w-2xl mx-8">
            <input
              type="text"
              readOnly
              placeholder="Rechercher une activité, une aide financière..."
              className="w-full py-3 px-4 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
              onClick={() => setSearchOpen(true)}
            />
            <button
              onClick={() => setSearchOpen(true)}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 bg-brand-green rounded-full text-white hover:bg-brand-green/90 transition-colors"
            >
              🔍
            </button>
            
            {/* FilterPopover intégré */}
            <FilterPopover
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onOpen={() => setFiltersOpen(true)}
              date={date}
              onDateChange={setDate}
              age={age}
              onAgeChange={setAge}
              activity={activity}
              onActivityChange={setActivity}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onApply={handleApplyFilters}
            />
          </div>

          <div className="flex items-center justify-end gap-x-1 sm:gap-x-2.5 md:gap-x-6">
            {/* Notifications et Avatar - toujours visibles */}
            <NotifyDropdown className="hidden sm:block" />
            <AvatarDropdown className="hidden sm:block" />
            
            {/* Version mobile condensée */}
            <div className="flex items-center gap-x-1 sm:hidden">
              <NotifyDropdown />
              <AvatarDropdown />
            </div>
            
            {/* Menu hamburger pour mobile */}
            <div className="block lg:hidden">
              <HamburgerBtnMenu />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
