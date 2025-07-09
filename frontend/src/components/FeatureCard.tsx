// src/components/FeatureCard.tsx
"use client";

import Link from 'next/link';
import React from 'react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export default function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-brand-grey/10 rounded-xl border border-brand-grey/20 shadow-md hover:shadow-lg transition-all hover:scale-105 dark:bg-neutral-800 dark:border-neutral-700 group"
    >
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">{icon}</span>
        <h3 className="text-h4 font-bold text-brand-dark dark:text-white">{title}</h3>
      </div>
      <p className="text-base text-brand-dark/70 dark:text-neutral-400 mb-4">{description}</p>
      <span className="inline-flex items-center text-brand-green font-bold hover:text-brand-green/80 transition-colors">
        Découvrir →
      </span>
    </Link>
  );
}
