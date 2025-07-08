'use client';

import { Button } from '@/shared/Button';
import { useState } from 'react';

interface Props {
  provider: string;
  activityId: number | string;
}

export default function ContactForm({ provider, activityId }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { ...formData, provider, activityId });
    // Ici vous pouvez ajouter la logique d'envoi
    alert('Message envoyé ! Le prestataire vous contactera bientôt.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Contacter {provider}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre nom
          </label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom complet" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre email
          </label>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre.email@exemple.com" 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre message
          </label>
          <textarea 
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Posez vos questions sur cette activité..." 
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green" 
            rows={4}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-brand-green hover:bg-brand-green/90 text-white"
        >
          Envoyer le message
        </Button>
      </form>
    </div>
  );
}
