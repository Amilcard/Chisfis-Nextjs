'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import FilterPopover from './FilterPopover'

interface Props {
  className?: string
  defaultValue?: string
  onSearch?: (filters: any) => void
}

export default function InklusifSearchForm({ className, defaultValue = '', onSearch }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)
  const [filtersLabel, setFiltersLabel] = useState('Rechercher une activité…')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // États pour les filtres
  const [date, setDate] = useState('Toute date')
  const [age, setAge] = useState('Tous âges')
  const [activity, setActivity] = useState('Toutes activités')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400])

  const handleFilterApply = (label?: string) => {
    setFiltersLabel(label || 'Filtres appliqués')
    setIsPopoverOpen(false)
    // Optionnellement rediriger vers la recherche avec les filtres
    router.push('/search')
  }

  const handleSearch = () => {
    const searchParams = new URLSearchParams()
    if (query.trim()) {
      searchParams.set('q', query.trim())
    }
    
    // Appeler onSearch si fourni
    if (onSearch) {
      onSearch({ query: query.trim() })
    } else {
      // Sinon, rediriger vers la page de recherche
      router.push(`/search?${searchParams.toString()}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleInputClick = () => {
    setIsPopoverOpen(true)
  }

  return (
    <div className={`relative w-full max-w-3xl mx-auto ${className || ''}`}>
      <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
        {/* Champ de recherche principal */}
        <div className="flex-1 relative">
          <input
            type="text"
            readOnly
            value={filtersLabel}
            onClick={handleInputClick}
            placeholder="Rechercher une activité…"
            className="w-full pl-6 pr-4 py-4 text-lg border-0 rounded-l-xl focus:outline-none focus:ring-0 bg-transparent text-gray-800 placeholder-gray-500 cursor-pointer"
          />
        </div>
        
        {/* Bouton filtres avec popover */}
        <FilterPopover
          isOpen={isPopoverOpen}
          onClose={() => setIsPopoverOpen(false)}
          onOpen={() => setIsPopoverOpen(true)}
          date={date}
          onDateChange={setDate}
          age={age}
          onAgeChange={setAge}
          activity={activity}
          onActivityChange={setActivity}
          priceRange={priceRange}
          onPriceChange={setPriceRange}
          onApply={handleFilterApply}
        />
        
        {/* Bouton recherche */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center px-6 py-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-r-xl border-l border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
