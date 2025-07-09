'use client';

import { FC } from 'react';

interface SocialButtonProps {
  provider: 'google' | 'facebook' | 'snapchat' | 'tiktok';
  onClick: () => void;
}

const SocialButton: FC<SocialButtonProps> = ({ provider, onClick }) => {
  const getProviderConfig = (provider: string) => {
    switch (provider) {
      case 'google':
        return {
          bgColor: 'bg-red-500 hover:bg-red-600',
          icon: 'G',
          label: 'Google'
        };
      case 'facebook':
        return {
          bgColor: 'bg-blue-600 hover:bg-blue-700',
          icon: 'f',
          label: 'Facebook'
        };
      case 'snapchat':
        return {
          bgColor: 'bg-yellow-400 hover:bg-yellow-500',
          icon: '👻',
          label: 'Snapchat'
        };
      case 'tiktok':
        return {
          bgColor: 'bg-black hover:bg-gray-800',
          icon: '♪',
          label: 'TikTok'
        };
      default:
        return {
          bgColor: 'bg-gray-500 hover:bg-gray-600',
          icon: '?',
          label: provider
        };
    }
  };

  const config = getProviderConfig(provider);

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full ${config.bgColor} text-white font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2`}
      title={`Se connecter avec ${config.label}`}
    >
      {config.icon}
    </button>
  );
};

export default SocialButton;
