'use client'

import ActivitySearchForm from 'frontend/src/components/HeroSearchForm/ActivitySearchForm'
import clsx from 'clsx'

const HeroSearchFormMobile = ({ className }: { className?: string }) => {
  return (
    <div className={clsx(className, 'relative z-10 w-full max-w-4xl px-4')}>
      <ActivitySearchForm formStyle="small" />
    </div>
  )
}

export default HeroSearchFormMobile
