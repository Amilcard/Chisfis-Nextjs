'use client'

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { FC } from 'react'

interface FilterPopoverProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
  date: string
  onDateChange: (date: string) => void
  age: string
  onAgeChange: (age: string) => void
  activity: string
  onActivityChange: (activity: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onApply: () => void
}

const FilterPopover: FC<FilterPopoverProps> = ({
  isOpen,
  onClose,
  onOpen,
  date,
  onDateChange,
  age,
  onAgeChange,
  activity,
  onActivityChange,
  priceRange,
  onPriceChange,
  onApply
}) => {
  return (
    <button
      onClick={onOpen}
      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-neutral-100 rounded-full text-neutral-600 hover:bg-neutral-200 transition-colors dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-600"
      title="Filtres avancés"
    >
      ⚙️
    </button>
  )
}

export default FilterPopover
