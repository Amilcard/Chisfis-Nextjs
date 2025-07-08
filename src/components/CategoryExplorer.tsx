// src/components/CategoryExplorer.tsx
"use client";

import Link from 'next/link';
import React from 'react';

interface Category {
  icon: string;
  label: string;
  href: string;
}

interface CategoryExplorerProps {
  categories: Category[];
}

export default function CategoryExplorer({ categories }: CategoryExplorerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category, index) => (
        <Link
          key={index}
          href={category.href}
          className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
        >
          <span className="text-3xl mb-2">{category.icon}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{category.label}</span>
        </Link>
      ))}
    </div>
  );
}
