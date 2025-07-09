import { Button } from 'frontend/src/shared/Button';
import { useState } from 'react';

interface Props {
  activity: any;
}

export default function InscriptionForm({ activity }: Props) {
  const [formData, setFormData] = useState({
    childName: '',
    schedule: '',
    specialNeeds: ''
  });

  const mockChildren = [
    'Emma (8 ans)',
    'Lucas (12 ans)',
    'Ajouter un enfant...'
  ];

  const mockSchedules = [
    'Mercredi 14h-16h',
    'Samedi 10h-12h',
    'Samedi 14h-16h',
    'Vacances semaine 1',
    'Vacances semaine 2'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inscription form submitted:', { ...formData, activityId: activity.id });
    // Ici vous pouvez ajouter la logique d'inscription
    alert('Demande d\'inscription envoyée ! Vous recevrez une confirmation par email.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        S'inscrire à {activity.title}
      </h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Prix : {activity.price}€</span>
          {activity.financialAid && (
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Aide financière disponible
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choisissez un enfant
          </label>
          <select 
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            required
          >
            <option value="">Sélectionnez un enfant</option>
            {mockChildren.map((child, index) => (
              <option key={index} value={child}>{child}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Choisissez un créneau
          </label>
          <select 
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            required
          >
            <option value="">Sélectionnez un créneau</option>
            {mockSchedules.map((schedule, index) => (
              <option key={index} value={schedule}>{schedule}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Besoins spéciaux ou commentaires (optionnel)
          </label>
          <textarea 
            name="specialNeeds"
            value={formData.specialNeeds}
            onChange={handleChange}
            placeholder="Allergies, handicap, remarques particulières..." 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Sauvegarder le brouillon
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white"
          >
            Demander l'inscription
          </Button>
        </div>
      </form>
    </div>
  );
}
