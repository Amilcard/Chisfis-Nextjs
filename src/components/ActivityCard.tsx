import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, MapPinIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/solid';

interface Activity {
  id: number;
  theme: string;
  title: string;
  provider: string;
  location: string;
  date: string;
  schedule: string;
  price: number;
  financialAid: string[];
  installment: boolean;
  disabilityAccess: boolean;
  ecoMobility: string;
  ageRanges: string[];
  imageUrl: string;
}

interface Props {
  activity: Activity;
  large?: boolean;
  clickable?: boolean;
}

export default function ActivityCard({ activity, large = false, clickable = true }: Props) {
  if (large) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image principale */}
        <div className="relative h-64 md:h-80">
          <Image
            src={activity.imageUrl}
            alt={activity.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-medium">
              {activity.theme}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-lg font-bold">
              {activity.price}€
            </span>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {activity.title}
              </h1>
              <p className="text-gray-600 text-sm mb-2">
                Proposé par <span className="font-medium">{activity.provider}</span>
              </p>
            </div>
            <div className="flex items-center">
              <StarIcon className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 font-medium">4.5</span>
              <span className="ml-1 text-gray-500">(12)</span>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Une excellente activité {activity.theme} proposée par {activity.provider} dans un cadre convivial et adapté aux enfants.
          </p>

          {/* Informations pratiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-2 text-brand-green" />
              <span className="text-sm">{activity.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="w-5 h-5 mr-2 text-brand-green" />
              <span className="text-sm">{activity.schedule}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <UserGroupIcon className="w-5 h-5 mr-2 text-brand-green" />
              <span className="text-sm">{activity.ageRanges.join(', ')}</span>
            </div>
          </div>

          {/* Badges des services */}
          <div className="flex flex-wrap gap-2">
            {activity.disabilityAccess && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                ♿ Accessibilité
              </span>
            )}
            {activity.ecoMobility && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                🚲 {activity.ecoMobility}
              </span>
            )}
            {activity.financialAid.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                💰 {activity.financialAid.join(', ')}
              </span>
            )}
            {activity.installment && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                💳 Paiement échelonné
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Version compacte (existante)
  const cardContent = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={activity.imageUrl}
          alt={activity.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white px-2 py-1 rounded text-sm font-semibold">
            {activity.price}€
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{activity.provider}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="ml-1 text-sm">4.5</span>
          </div>
          <span className="text-xs text-gray-500">{activity.ageRanges.join(', ')}</span>
        </div>
      </div>
    </div>
  );

  return clickable ? (
    <Link href={`/activity/${activity.id}`}>
      {cardContent}
    </Link>
  ) : cardContent;
}
