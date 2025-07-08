// src/app/(app)/(home-pages)/PageNavigation.tsx
"use client";

import Link from 'next/link';
import React from 'react';

export default function PageNavigation() {
  return (
    <nav className="flex space-x-4 p-4 border-b bg-white dark:bg-gray-800">
      <Link 
        href="/" 
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
      >
        Accueil
      </Link>
      <Link 
        href="/search" 
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        Rechercher
      </Link>
      <Link 
        href="/activities" 
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        Activités
      </Link>
      <Link 
        href="/account/profile" 
        className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
      >
        Mon Compte
      </Link>
    </nav>
  );
}
