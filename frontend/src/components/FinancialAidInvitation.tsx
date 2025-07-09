'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'frontend/src/shared/Button';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
  activityTitle?: string;
}

export default function FinancialAidInvitation({ onAccept, onDecline, activityTitle }: Props) {
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
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800">
      {/* Header avec icône */}
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">💰</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2">
            Votre inscription est confirmée ! 🎉
          </h3>
          {activityTitle && (
            <p className="text-green-800 dark:text-green-300 text-sm mb-3">
              Votre enfant est inscrit à <strong>{activityTitle}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Message d'invitation inspirant */}
      <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-6">
        <p className="text-green-800 dark:text-green-200 text-sm leading-relaxed">
          <strong>Beaucoup de familles peuvent bénéficier d'aides pour financer les activités de leurs enfants.</strong>
          <br />
          En 2 minutes, découvrez si vous pouvez obtenir une réduction, une aide de la CAF ou de la mairie.
        </p>
      </div>

      {/* Question et CTAs */}
      <div className="space-y-3">
        <p className="text-green-900 dark:text-green-200 font-medium">
          Voulez-vous vérifier vos droits ?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAccept}
            className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            👉 Oui, je veux estimer mes aides
          </Button>
          
          <Button 
            onClick={handleDecline}
            color="light"
            className="flex-1 py-3 rounded-lg font-medium transition-colors"
          >
            👉 Non, merci, je continue
          </Button>
        </div>
      </div>

      {/* Info rassurante */}
      <div className="mt-4 text-center">
        <p className="text-xs text-green-700 dark:text-green-400">
          ✨ Cette estimation est gratuite et sans engagement
        </p>
      </div>
    </div>
  );
}
