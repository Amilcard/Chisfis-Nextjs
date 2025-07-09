'use client';

import { useState } from 'react';
import FinancialAidInvitation from './FinancialAidInvitation';
import FinancialAidProgressiveForm from './FinancialAidProgressiveForm';
import EcoMobilityInvitation from './EcoMobilityInvitation';
import EcoMobilityProgressiveForm from './EcoMobilityProgressiveForm';

interface Props {
  activityTitle?: string;
  activityLocation?: string;
  onComplete?: () => void;
}

type FlowStep = 'financial-invitation' | 'financial-form' | 'eco-invitation' | 'eco-form' | 'complete';

export default function PostInscriptionFlow({ activityTitle, activityLocation, onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('financial-invitation');
  const [financialAidData, setFinancialAidData] = useState<any>(null);
  const [ecoMobilityData, setEcoMobilityData] = useState<any>(null);

  // Gestionnaires pour les aides financières
  const handleFinancialAidAccept = () => {
    setCurrentStep('financial-form');
  };

  const handleFinancialAidDecline = () => {
    setCurrentStep('eco-invitation');
  };

  const handleFinancialAidComplete = async (data: any) => {
    try {
      // Appel API pour l'estimation des aides
      const response = await fetch('/api/financial-aid/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          familySituation: data.familySituation,
          quotientFamilial: data.quotientFamilial ? parseInt(data.quotientFamilial) : undefined,
          cafNumber: data.cafNumber,
          aidTypes: data.aidTypes,
          activityTitle
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFinancialAidData(result.data);
        
        // Afficher les résultats brièvement puis passer à l'éco-mobilité
        setTimeout(() => {
          setCurrentStep('eco-invitation');
        }, 3000);
      } else {
        console.error('Erreur lors de l\'estimation des aides');
        setCurrentStep('eco-invitation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'estimation des aides:', error);
      setCurrentStep('eco-invitation');
    }
  };

  const handleFinancialAidCancel = () => {
    setCurrentStep('eco-invitation');
  };

  // Gestionnaires pour l'éco-mobilité
  const handleEcoMobilityAccept = () => {
    setCurrentStep('eco-form');
  };

  const handleEcoMobilityDecline = () => {
    setCurrentStep('complete');
    if (onComplete) onComplete();
  };

  const handleEcoMobilityComplete = async (data: any) => {
    try {
      // Appel API pour les options d'éco-mobilité
      const response = await fetch('/api/eco-mobility/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: data.address,
          to: activityLocation || '',
          preferences: {
            ecoFriendlyOnly: data.sustainabilityLevel === 'high',
            maxDuration: 60
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setEcoMobilityData(result.data);
        
        // Afficher les résultats brièvement puis terminer
        setTimeout(() => {
          setCurrentStep('complete');
          if (onComplete) onComplete();
        }, 3000);
      } else {
        console.error('Erreur lors du calcul des options de mobilité');
        setCurrentStep('complete');
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error('Erreur lors du calcul des options de mobilité:', error);
      setCurrentStep('complete');
      if (onComplete) onComplete();
    }
  };

  const handleEcoMobilityCancel = () => {
    setCurrentStep('complete');
    if (onComplete) onComplete();
  };

  // Rendu des résultats d'aides financières
  const renderFinancialResults = () => {
    if (!financialAidData) return null;

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎉</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2">
              Résultats de votre estimation
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {financialAidData.eligibleCount} aide(s) financière(s) identifiée(s)
              </p>
              {financialAidData.totalSavings > 0 && (
                <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Économies estimées : {financialAidData.totalSavings}€/an
                </p>
              )}
            </div>
            {financialAidData.estimates && financialAidData.estimates.length > 0 && (
              <div className="space-y-2">
                {financialAidData.estimates
                  .filter((aid: any) => aid.eligible)
                  .slice(0, 3)
                  .map((aid: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <span className="text-sm font-medium">{aid.name}</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {aid.estimatedSaving}€/an
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Rendu des résultats d'éco-mobilité
  const renderEcoMobilityResults = () => {
    if (!ecoMobilityData) return null;

    return (
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 dark:from-blue-900/20 dark:to-green-900/20 dark:border-blue-800 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🚲</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-2">
              Vos solutions de transport
            </h3>
            {ecoMobilityData.routes && ecoMobilityData.routes.length > 0 && (
              <div className="space-y-2">
                {ecoMobilityData.routes.slice(0, 3).map((route: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{route.icon}</span>
                      <span className="text-sm font-medium">{route.mode}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{route.duration}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {route.co2Savings && `${route.co2Savings}kg CO2 économisés`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'financial-invitation':
        return (
          <FinancialAidInvitation
            onAccept={handleFinancialAidAccept}
            onDecline={handleFinancialAidDecline}
            activityTitle={activityTitle}
          />
        );

      case 'financial-form':
        return (
          <FinancialAidProgressiveForm
            onComplete={handleFinancialAidComplete}
            onCancel={handleFinancialAidCancel}
          />
        );

      case 'eco-invitation':
        return (
          <div>
            {renderFinancialResults()}
            <EcoMobilityInvitation
              onAccept={handleEcoMobilityAccept}
              onDecline={handleEcoMobilityDecline}
              activityLocation={activityLocation}
            />
          </div>
        );

      case 'eco-form':
        return (
          <div>
            {renderFinancialResults()}
            <EcoMobilityProgressiveForm
              onComplete={handleEcoMobilityComplete}
              onCancel={handleEcoMobilityCancel}
              destination={activityLocation}
            />
          </div>
        );

      case 'complete':
        return (
          <div className="text-center py-8">
            {renderFinancialResults()}
            {renderEcoMobilityResults()}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Tout est prêt !
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Votre inscription est confirmée et vous avez toutes les informations nécessaires.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Vous recevrez bientôt un email de confirmation avec tous les détails.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {renderCurrentStep()}
    </div>
  );
}
