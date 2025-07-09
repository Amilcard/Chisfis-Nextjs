'use client';

import { HomeIcon, MagnifyingGlassIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Accueil', href: '/', icon: HomeIcon },
  { name: 'Recherche', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Autour de moi', href: '/map', icon: MapPinIcon },
  { name: 'Profil', href: '/account', icon: UserIcon },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2 px-1 ${
                isActive
                  ? 'text-brand-green bg-green-50'
                  : 'text-gray-600 hover:text-brand-green'
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${isActive ? 'text-brand-green' : 'text-gray-600'}`}
                aria-hidden="true"
              />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
