'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import FilterPopover from './FilterPopover';
import { ButtonSubmit } from './ui';

interface Props {
  className?: string;
  formStyle?: 'default' | 'small';
}

export default function ActivitySearchForm({ className, formStyle = 'default' }: Props) {
  const router = useRouter();
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
    
    // Redirection vers la page de recherche avec les filtres
    const params = new URLSearchParams();
    if (activity !== 'Toutes activités') params.set('category', activity);
    if (age !== 'Tous âges') params.set('age', age);
    if (date !== 'Toute date') params.set('date', date);
    if (priceRange[0] > 0 || priceRange[1] < 400) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const handleFormSubmit = (formData: FormData) => {
    handleApply();
  };

  return (
    <Form
      className={clsx(
        'relative z-10 flex w-full rounded-full bg-white [--form-bg:var(--color-white)] dark:bg-neutral-800 dark:[--form-bg:var(--color-neutral-800)]',
        className,
        formStyle === 'small' && 'custom-shadow-1',
        formStyle === 'default' && 'shadow-xl dark:shadow-2xl'
      )}
      action={handleFormSubmit}
    >
      {/* Champ de recherche principal avec style natif */}
      <div className="relative flex-1 flex items-center">
        <input
          type="text"
          readOnly
          value={filtersLabel}
          onClick={() => setIsOpen(true)}
          className="w-full px-5 py-4 bg-transparent border-0 rounded-l-full focus:outline-none cursor-pointer text-sm lg:text-base placeholder-neutral-500 text-neutral-900 dark:text-neutral-100"
          placeholder="Rechercher une activité…"
        />
        
        <FilterPopover
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onOpen={() => setIsOpen(true)}
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
      </div>

      {/* Bouton de recherche avec style natif */}
      <ButtonSubmit 
        className="ms-auto rounded-e-full" 
        fieldStyle={formStyle}
      />
    </Form>
  );
}
