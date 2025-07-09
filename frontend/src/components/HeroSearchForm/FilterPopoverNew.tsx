'use client';

import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  onDateChange: (date: string) => void;
  age: string;
  onAgeChange: (age: string) => void;
  activity: string;
  onActivityChange: (activity: string) => void;
  priceRange: [number, number];
  onPriceChange: (priceRange: [number, number]) => void;
  onApply: () => void;
}

export default function FilterPopover({ 
  isOpen, 
  onClose, 
  date, 
  onDateChange,
  age, 
  onAgeChange,
  activity, 
  onActivityChange,
  priceRange, 
  onPriceChange,
  onApply 
}: Props) {

  const handleReset = () => {
    onDateChange('Toute date');
    onAgeChange('Tous âges');
    onActivityChange('Toutes activités');
    onPriceChange([0, 400]);
  };

  return (
    <Popover as={Fragment}>
      <Popover.Button className="flex items-center justify-center p-4 border-l border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
        <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-600" />
      </Popover.Button>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl rounded-xl z-50 p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
              <button
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Réinitialiser
              </button>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <button
                onClick={() => onDateChange('Dates sélectionnées')} // Placeholder pour sélecteur de date
                className="w-full p-3 text-left border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                {date}
              </button>
            </div>

            {/* Âge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Âge
              </label>
              <select
                value={age}
                onChange={(e) => onAgeChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option>Tous âges</option>
                <option>3–6 ans</option>
                <option>7–10 ans</option>
                <option>11–14 ans</option>
                <option>15–17 ans</option>
              </select>
            </div>

            {/* Activité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'activité
              </label>
              <select
                value={activity}
                onChange={(e) => onActivityChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option>Toutes activités</option>
                <option>Sport</option>
                <option>Culture</option>
                <option>Loisir</option>
                <option>Vacances</option>
                <option>Scolarité</option>
              </select>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget ({priceRange[0]}–{priceRange[1]} €)
              </label>
              <div className="px-2">
                <Slider
                  range
                  min={0}
                  max={400}
                  step={5}
                  value={priceRange}
                  onChange={(value) => onPriceChange(value as [number, number])}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{priceRange[0]} €</span>
                  <span>{priceRange[1]} €</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={onApply}
                className="flex-1 px-4 py-2 text-white bg-primary-500 hover:bg-primary-600 rounded-lg font-medium transition-colors"
              >
                Appliquer
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
