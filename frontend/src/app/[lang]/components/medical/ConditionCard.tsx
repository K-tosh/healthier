import Link from 'next/link';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { getStrapiMedia } from '../../utils/api-helpers';
import { 
  AlertTriangle, 
  Heart, 
  Info, 
  Shield, 
  Stethoscope,
  ArrowRight
} from 'lucide-react';

interface ConditionCardProps {
  condition: {
    id: number;
    attributes: {
      name: string;
      slug: string;
      description: string;
      isEmergency: boolean;
      prevalenceInKenya?: string;
      color?: string;
      icon?: {
        data?: {
          attributes: {
            url: string;
            alternativeText?: string;
          };
        };
      };
    };
  };
  lang: string;
}

const cardConfig = {
  standard: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgGradient: 'from-blue-50 to-white',
    icon: Stethoscope,
    label: 'Condition',
    description: ''
  },
  emergency: {
    color: 'bg-red-100 text-red-800 border-red-200',
    bgGradient: 'from-red-50 to-white',
    icon: AlertTriangle,
    label: 'Emergency Condition',
    description: 'Immediate care required'
  }
};

export default function ConditionCard({ condition, lang }: ConditionCardProps) {
  const { name, slug, description, isEmergency, prevalenceInKenya, color, icon } = condition.attributes;
  const cardInfo = cardConfig[isEmergency ? 'emergency' : 'standard'];
  const CardIcon = cardInfo.icon;
  const iconUrl = getStrapiMedia(icon?.data?.attributes.url || null);

  return (
    <Link
      href={`/${lang}/conditions/${slug}`}
      className="group block h-full"
    >
      <div className={`medical-card h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 bg-gradient-to-br ${cardInfo.bgGradient} border-l-4`}
           style={{ borderLeftColor: color || '#3B82F6' }}>
        
        {/* Card Header */}
        <div className="p-6 flex-1">
          {/* Top Section - Icon and Emergency Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {iconUrl ? (
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm p-2 flex items-center justify-center">
                  <Image
                    src={iconUrl}
                    alt={icon?.data?.attributes.alternativeText || name}
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div 
                  className="w-12 h-12 rounded-lg shadow-sm p-2 flex items-center justify-center"
                  style={{ backgroundColor: color || '#3B82F6', opacity: 0.1 }}
                >
                  <CardIcon className="w-6 h-6" style={{ color: color || '#3B82F6' }} />
                </div>
              )}
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                  {name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <CardIcon className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">{cardInfo.label}</span>
                </div>
              </div>
            </div>

            {isEmergency && (
              <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse shrink-0">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Emergency
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">
            {description.length > 150 ? `${description.substring(0, 150)}...` : description}
          </p>

          {/* Badges Section */}
          <div className="space-y-3 mb-4">
            <div className="flex flex-wrap gap-2">
              {isEmergency && (
                <Badge className={`${cardConfig.emergency.color} text-xs font-semibold`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {cardConfig.emergency.label}
                </Badge>
              )}
              
              {!isEmergency && (
                <Badge className={`${cardConfig.standard.color} text-xs font-semibold`}>
                  <CardIcon className="w-3 h-3 mr-1" />
                  {cardConfig.standard.label}
                </Badge>
              )}
              
              {prevalenceInKenya && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  <Info className="w-3 h-3 mr-1" />
                  {prevalenceInKenya}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {cardInfo.description}
            </div>
            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-800 transition-colors duration-200">
              Learn more
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
          
          {/* Quick Action Indicator */}
          {isEmergency && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded p-2">
              <div className="flex items-center gap-2 text-red-800 text-xs font-semibold">
                <AlertTriangle className="w-3 h-3" />
                Emergency condition - Seek immediate care
              </div>
            </div>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-50 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}