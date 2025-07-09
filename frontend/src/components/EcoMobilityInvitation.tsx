'use client';

import { useState } from 'react';
import { Button } from 'frontend/src/shared/Button';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
  activityLocation?: string;
}

export default function EcoMobilityInvitation({ onAccept, onDecline, activityLocation }: Props) {
  const [isVisible, setIsVisible] = useState(true);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 dark:from-blue-900/20 dark:to-green-900/20 dark:border-blue-800">
      {/* Header avec icône */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">🚲</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-2">
            Comment vous rendre à l'activité ? 🌱
          </h3>
          {activityLocation && (
            <p className="text-blue-800 dark:text-blue-300 text-sm mb-3">
              Destination : <strong>{activityLocation}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Message d'invitation */}
      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-6">
        <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
          <strong>Savez-vous que des solutions existent pour faciliter vos déplacements ?</strong>
          <br />
          Découvrez les transports en commun, le covoiturage, et les aides éco-mobilité proposées pour rejoindre l'activité.
        </p>
      </div>

      {/* Aperçu des solutions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 bg-white/30 dark:bg-black/10 rounded-lg">
          <div className="text-2xl mb-1">🚌</div>
          <div className="text-xs text-blue-800 dark:text-blue-300">Transport public</div>
        </div>
        <div className="text-center p-3 bg-white/30 dark:bg-black/10 rounded-lg">
          <div className="text-2xl mb-1">🚗</div>
          <div className="text-xs text-blue-800 dark:text-blue-300">Covoiturage</div>
        </div>
        <div className="text-center p-3 bg-white/30 dark:bg-black/10 rounded-lg">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs text-blue-800 dark:text-blue-300">Aides mobilité</div>
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            👉 Oui, je souhaite voir les solutions
          </Button>
          
          <Button 
            onClick={handleDecline}
            color="light"
            className="flex-1 py-3 rounded-lg font-medium transition-colors"
          >
            👉 Non merci
          </Button>
        </div>
      </div>

      {/* Info rassurante */}
      <div className="mt-4 text-center">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          🌍 Ensemble, adoptons une mobilité plus durable
        </p>
      </div>
    </div>
  );
}
