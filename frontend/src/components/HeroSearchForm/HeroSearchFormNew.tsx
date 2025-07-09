'use client';

import React, { useState } from 'react';
import FilterPopover from './FilterPopoverNew';
import ButtonPrimary from 'frontend/src/shared/ButtonPrimary';

interface Props {
  className?: string;
  onSearch?: (filters: {
    date: string;
    age: string;
    activity: string;
    priceRange: [number, number];
  }) => void;
}

export default function HeroSearchForm({ onSearch, className }: Props) {
  const [filtersLabel, setFiltersLabel] = useState('Rechercher une activité…');
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState('Toute date');
  const [age, setAge] = useState('Tous âges');
  const [activity, setActivity] = useState('Toutes activités');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 400]);

  // Générer le label résumé intelligent
  const generateSummaryLabel = () => {
    const parts: string[] = [];
    
    if (activity !== 'Toutes activités') {
      parts.push(activity);
    }
    
    if (age !== 'Tous âges') {
      parts.push(age);
    }
    
    if (priceRange[0] > 0 || priceRange[1] < 400) {
      parts.push(`${priceRange[0]}–${priceRange[1]} €`);
    }
    
    if (date !== 'Toute date') {
      parts.push(date);
    }
    
    return parts.length > 0 ? parts.join(' · ') : 'Rechercher une activité…';
  };

  const handleApply = () => {
    const summaryLabel = generateSummaryLabel();
    setFiltersLabel(summaryLabel);
    setIsOpen(false);
    onSearch?.({ date, age, activity, priceRange });
  };

  return (
    <div className={`relative flex items-center w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 ${className || ''}`}>
      <input
        type="text"
        readOnly
        value={filtersLabel}
        onClick={() => setIsOpen(true)}
        className="flex-1 p-4 border-0 rounded-l-xl focus:outline-none cursor-pointer bg-transparent text-gray-800 placeholder-gray-500"
        placeholder="Rechercher une activité…"
      />
      <FilterPopover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        date={date}
        onDateChange={setDate}
        age={age}
        onAgeChange={setAge}
        activity={activity}
        onActivityChange={setActivity}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        onApply={handleApply}
      />
      <ButtonPrimary className="rounded-r-xl px-6 py-4 ml-0" onClick={handleApply}>
        Rechercher
      </ButtonPrimary>
    </div>
  );
}
