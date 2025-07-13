

1/1

Next.js 15.3.2 (stale)
Webpack
Build Error

Module not found: Can't resolve '@/shared/SwitchDarkMode2'

./src/app/customize-control.tsx (3:1)

Module not found: Can't resolve '@/shared/SwitchDarkMode2'
  1 | 'use client'
  2 |
> 3 | import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
    | ^
  4 | import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
  5 | import { Cog8ToothIcon as CogIcon, ShoppingBagIcon as ShoppingCartIcon } from '@heroicons/react/24/outline'
  6 | import Link from 'next/link'

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./src/app/layout.tsx