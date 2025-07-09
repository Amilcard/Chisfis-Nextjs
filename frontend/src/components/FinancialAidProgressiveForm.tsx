'use client';

import { useState } from 'react';
import { Button } from 'frontend/src/shared/Button';

interface FormData {
  address: string;
  city: string;
  postalCode: string;
  familySituation: 'single' | 'couple' | 'other' | '';
  quotientFamilial: string;
  cafNumber: string;
  aidTypes: string[];
  calculationMethod: 'known' | 'calculate' | '';
}

interface Props {
  onComplete: (data: FormData) => void;
  onCancel: () => void;
}

export default function FinancialAidProgressiveForm({ onComplete, onCancel }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    address: '',
    city: '',
    postalCode: '',
    familySituation: '',
    quotientFamilial: '',
    cafNumber: '',
    aidTypes: [],
    calculationMethod: ''
  });

  const totalSteps = 4;

  const handleFieldChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const handleAidTypeToggle = (aidType: string) => {
    const currentAids = formData.aidTypes;
    if (currentAids.includes(aidType)) {
      handleFieldChange('aidTypes', currentAids.filter(aid => aid !== aidType));
    } else {
      handleFieldChange('aidTypes', [...currentAids, aidType]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">📍 Votre adresse</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cette info permet de trouver les aides adaptées à votre commune
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <input
                type="text"
                placeholder="Ex: 12 rue de la République"
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ville</label>
                <input
                  type="text"
                  placeholder="Saint-Étienne"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code postal</label>
                <input
                  type="text"
                  placeholder="42000"
                  value={formData.postalCode}
                  onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">👨‍👩‍👧‍👦 Situation familiale</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Facultatif, juste pour filtrer les aides disponibles
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'single', label: 'Parent seul', icon: '👤' },
                { id: 'couple', label: 'Couple', icon: '👫' },
                { id: 'other', label: 'Autre situation', icon: '👥' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleFieldChange('familySituation', option.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors flex items-center gap-3 ${
                    formData.familySituation === option.id
                      ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">💳 Quotient familial CAF</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Si vous le connaissez, sinon nous vous aiderons à le calculer
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => handleFieldChange('calculationMethod', 'known')}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  formData.calculationMethod === 'known'
                    ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📋</span>
                  <span className="font-medium">Je connais mon quotient familial</span>
                </div>
                {formData.calculationMethod === 'known' && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="number"
                      placeholder="Ex: 850"
                      value={formData.quotientFamilial}
                      onChange={(e) => handleFieldChange('quotientFamilial', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      placeholder="Numéro allocataire CAF (facultatif)"
                      value={formData.cafNumber}
                      onChange={(e) => handleFieldChange('cafNumber', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
                    />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleFieldChange('calculationMethod', 'calculate')}
                className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                  formData.calculationMethod === 'calculate'
                    ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧮</span>
                  <div>
                    <div className="font-medium">Je souhaite le calculer rapidement</div>
                    <div className="text-sm text-gray-600">Calcul estimatif en 1 minute</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">🎯 Types d'aides recherchées</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sélectionnez les aides qui vous intéressent
              </p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'municipal', label: 'Aides de la mairie', description: 'Quotient familial, tarifs réduits', icon: '🏛️' },
                { id: 'caf', label: 'Aides CAF', description: 'Prestations familiales, bons vacances', icon: '👶' },
                { id: 'ancv', label: 'Chèques ANCV', description: 'Chèques vacances, Pass+ Sport', icon: '🎫' },
                { id: 'pass_colo', label: 'Pass Colo', description: 'Aide pour les colonies de vacances', icon: '🏕️' },
                { id: 'other', label: 'Autres dispositifs', description: 'Aides régionales, entreprise', icon: '✨' }
              ].map((aid) => (
                <button
                  key={aid.id}
                  onClick={() => handleAidTypeToggle(aid.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors flex items-start gap-3 ${
                    formData.aidTypes.includes(aid.id)
                      ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <span className="text-2xl mt-1">{aid.icon}</span>
                  <div>
                    <div className="font-medium">{aid.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{aid.description}</div>
                  </div>
                  {formData.aidTypes.includes(aid.id) && (
                    <span className="text-brand-green ml-auto mt-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl mx-auto border border-gray-200 dark:border-gray-700">
      {/* Header avec progression */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Estimation des aides
          </h2>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Barre de progression */}
        <div className="flex items-center gap-2 mb-2">
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full ${
                index + 1 <= currentStep ? 'bg-brand-green' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Étape {currentStep} sur {totalSteps}
        </p>
      </div>

      {/* Contenu de l'étape */}
      <div className="mb-8">
        {renderStep()}
      </div>

      {/* Boutons de navigation */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-3 flex-1">
          {currentStep > 1 && (
            <Button
              onClick={prevStep}
              color="light"
              className="px-6 py-3"
            >
              ← Précédent
            </Button>
          )}
          
          <Button
            onClick={skipStep}
            color="light"
            className="px-6 py-3"
          >
            Je ne souhaite pas renseigner
          </Button>
        </div>
        
        <Button
          onClick={nextStep}
          className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3"
        >
          {currentStep === totalSteps ? 'Estimer mes aides' : 'Suivant →'}
        </Button>
      </div>
    </div>
  );
}
