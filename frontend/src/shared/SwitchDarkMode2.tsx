'use client'

import { ThemeContext } from 'frontend/src/app/theme-provider'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { useContext } from 'react'

interface SwitchDarkMode2Props {
  className?: string
}
const SwitchDarkMode2: React.FC<SwitchDarkMode2Props> = ({ className }) => {
  const theme = useContext(ThemeContext)

  return (
    <div className={clsx('inline-flex', className)}>
      <span className="sr-only">Enable dark mode</span>
      <Switch
        checked={theme?.isDarkMode}
        onChange={theme?.toggleDarkMode}
        className={`${theme?.isDarkMode ? 'bg-teal-900' : 'bg-teal-600'} relative inline-flex h-[22px] w-[42px] shrink-0 cursor-pointer rounded-full border-4 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white/75`}
      >
        <span className="sr-only">Enable dark mode</span>
        <span
          aria-hidden="true"
          className={`${theme?.isDarkMode ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </div>
  )
}

export default SwitchDarkMode2
