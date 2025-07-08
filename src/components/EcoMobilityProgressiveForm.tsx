'use client';

import { useState } from 'react';
import { Button } from '@/shared/Button';

interface TransportOption {
  id: string;
  type: 'public' | 'bike' | 'carpool' | 'walk';
  name: string;
  duration: string;
  cost: string;
  ecological: boolean;
  description: string;
  details: string[];
  icon: string;
}

interface Props {
  destination?: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export default function EcoMobilityProgressiveForm({ destination, onComplete, onCancel }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [startAddress, setStartAddress] = useState('');
  const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalSteps = 3;

  const handleAddressSubmit = async () => {
    if (!startAddress.trim()) return;
    
    setLoading(true);
    try {
      // Simulation d'appel API pour calculer les options
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const options = generateTransportOptions(startAddress, destination || 'Activité');
      setTransportOptions(options);
      setCurrentStep(2);
    } catch (error) {
      console.error('Erreur lors du calcul des itinéraires:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleComplete = () => {
    onComplete({
      address: startAddress,
      selectedOptions,
      transportPreferences: selectedOptions,
      constraints: [],
      sustainabilityLevel: 'high'
    });
  };

  const generateTransportOptions = (from: string, to: string): TransportOption[] => {
    return [
      {
        id: 'tram-t2',
        type: 'public',
        name: 'Tram T2',
        duration: '25 min',
        cost: 'Gratuit -18 ans',
        ecological: true,
        description: 'Tram direct avec une correspondance',
        details: [
          'Départ: Arrêt Châteaucreux',
          'Arrivée: Arrêt Bellevue',
          'Fréquence: toutes les 10 min',
          'Accessible PMR'
        ],
        icon: '🚊'
      },
      {
        id: 'bus-c1',
        type: 'public',
        name: 'Bus C1',
        duration: '18 min',
        cost: 'Gratuit -18 ans',
        ecological: true,
        description: 'Bus direct, pas de correspondance',
        details: [
          'Ligne directe',
          'Arrêt à 200m de l\'activité',
          'Fréquence: toutes les 15 min',
          'Vélos acceptés'
        ],
        icon: '🚌'
      },
      {
        id: 'bike-share',
        type: 'bike',
        name: 'Vélo en libre-service',
        duration: '12 min',
        cost: '1€/30min',
        ecological: true,
        description: 'Vélos électriques disponibles',
        details: [
          '2 stations à proximité du départ',
          '1 station d\'arrivée proche',
          'Vélos électriques',
          'Application VéliVert'
        ],
        icon: '🚲'
      },
      {
        id: 'carpool-family',
        type: 'carpool',
        name: 'Covoiturage familial',
        duration: '8 min',
        cost: '2-3€ partagés',
        ecological: true,
        description: 'Partagez avec d\'autres familles',
        details: [
          '3 familles intéressées trouvées',
          'Partage des frais équitable',
          'Groupe WhatsApp organisé',
          'Retour également organisé'
        ],
        icon: '🚗'
      },
      {
        id: 'walk',
        type: 'walk',
        name: 'À pied',
        duration: '22 min',
        cost: 'Gratuit',
        ecological: true,
        description: 'Parcours sécurisé et agréable',
        details: [
          'Itinéraire par le parc',
          'Chemins piétons sécurisés',
          'Bonne activité physique',
          'Découverte du quartier'
        ],
        icon: '🚶'
      }
    ];
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">📍 Votre point de départ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                D'où partirez-vous pour vous rendre à l'activité ?
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Adresse de départ</label>
              <input
                type="text"
                placeholder="Ex: 12 rue de la République, Saint-Étienne"
                value={startAddress}
                onChange={(e) => setStartAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-brand-green dark:bg-gray-800 dark:border-gray-600"
                onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Destination :</strong> {destination || 'Activité'}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">🛣️ Options de transport</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sélectionnez les solutions qui vous intéressent
              </p>
            </div>
            
            <div className="space-y-3">
              {transportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${
                    selectedOptions.includes(option.id)
                      ? 'border-brand-green bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{option.name}</h4>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">⏱️ {option.duration}</span>
                          <span className="text-green-600 font-medium">{option.cost}</span>
                          {option.ecological && <span className="text-green-500">🌱</span>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {option.description}
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        {option.details.map((detail, index) => (
                          <div key={index}>• {detail}</div>
                        ))}
                      </div>
                    </div>
                    {selectedOptions.includes(option.id) && (
                      <span className="text-brand-green text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">📧 Recevoir les détails</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comment souhaitez-vous recevoir les informations ?
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">✅ Solutions sélectionnées :</h4>
              <div className="space-y-2">
                {selectedOptions.map(optionId => {
                  const option = transportOptions.find(opt => opt.id === optionId);
                  return option ? (
                    <div key={optionId} className="flex items-center gap-2 text-sm">
                      <span>{option.icon}</span>
                      <span>{option.name}</span>
                      <span className="text-gray-600">({option.duration})</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full p-4 text-left border-2 border-brand-green bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-medium">Recevoir par email</div>
                    <div className="text-sm text-gray-600">Itinéraires détaillés et horaires</div>
                  </div>
                </div>
              </button>

              <button className="w-full p-4 text-left border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗓️</span>
                  <div>
                    <div className="font-medium">Ajouter au calendrier</div>
                    <div className="text-sm text-gray-600">Rappels de départ inclus</div>
                  </div>
                </div>
              </button>
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
            Solutions de transport 🚲
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
              onClick={() => setCurrentStep(currentStep - 1)}
              color="light"
              className="px-6 py-3"
            >
              ← Précédent
            </Button>
          )}
        </div>
        
        {currentStep === 1 ? (
          <Button
            onClick={handleAddressSubmit}
            disabled={!startAddress.trim() || loading}
            className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3"
          >
            {loading ? 'Calcul en cours...' : 'Calculer les itinéraires →'}
          </Button>
        ) : currentStep === 2 ? (
          <Button
            onClick={() => setCurrentStep(3)}
            disabled={selectedOptions.length === 0}
            className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3"
          >
            Continuer ({selectedOptions.length} sélectionnée{selectedOptions.length > 1 ? 's' : ''})
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3"
          >
            Recevoir les détails 📧
          </Button>
        )}
      </div>
    </div>
  );
}
