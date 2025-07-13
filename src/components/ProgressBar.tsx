'use client';

import { FC } from 'react';

interface ProgressBarProps {
  step: number;
  total: number;
}

const ProgressBar: FC<ProgressBarProps> = ({ step, total }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Étape {step} sur {total}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round((step / total) * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-brand-green h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 ${
              i + 1 <= step
                ? 'bg-brand-green border-brand-green'
                : 'bg-white border-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
