import { getStrapiMedia } from '../../utils/api-helpers';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Heart, Info, Shield, Stethoscope } from 'lucide-react';
import Image from 'next/image';

interface ConditionHeroProps {
  condition: {
    name: string;
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
}

const conditionConfig = {
  standard: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    bgColor: 'bg-blue-50',
    icon: Stethoscope,
    label: 'Health Condition',
    description: 'Medical information and guidance available'
  },
  emergency: {
    color: 'bg-red-100 text-red-800 border-red-200',
    bgColor: 'bg-red-50',
    icon: AlertTriangle,
    label: 'Emergency Condition',
    description: 'Requires immediate medical attention'
  }
};

export default function ConditionHero({ condition }: ConditionHeroProps) {
  const conditionInfo = conditionConfig[condition.isEmergency ? 'emergency' : 'standard'];
  const ConditionIcon = conditionInfo.icon;
  const iconUrl = getStrapiMedia(condition.icon?.data?.attributes.url || null);

  return (
    <section className="healthier-section-hero relative overflow-hidden">
      {/* Background gradient based on condition color */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${condition.color || '#3B82F6'} 0%, transparent 70%)`
        }}
      />
      
      <div className="content-container relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Condition Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {iconUrl && (
                  <div className="w-16 h-16 rounded-xl bg-white shadow-md p-3 flex items-center justify-center">
                    <Image
                      src={iconUrl}
                      alt={condition.icon?.data?.attributes.alternativeText || condition.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {condition.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <ConditionIcon className="w-4 h-4" />
                    <span className="text-sm font-medium text-gray-600">{conditionInfo.label}</span>
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
                {condition.description}
              </p>
            </div>

            {/* Badges and Indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={`${conditionInfo.color} font-semibold`}>
                <ConditionIcon className="w-3 h-3 mr-1" />
                {conditionInfo.label}
              </Badge>
              
              {condition.prevalenceInKenya && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {condition.prevalenceInKenya}
                </Badge>
              )}

              {condition.isEmergency && (
                <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Emergency Condition
                </Badge>
              )}
            </div>

            {/* Emergency Alert */}
            {condition.isEmergency && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Emergency Medical Condition:</strong> If you suspect you have this condition, 
                  seek immediate medical attention or call emergency services at <strong>999</strong>.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Quick Facts Sidebar */}
          <div className="space-y-4">
            <div className={`medical-card p-6 ${conditionInfo.bgColor} border-l-4`}
                 style={{borderLeftColor: condition.color || '#3B82F6'}}>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Quick Medical Facts
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Condition Type:</span>
                  <Badge className={`${conditionInfo.color} text-xs`}>
                    {conditionInfo.label.toUpperCase()}
                  </Badge>
                </div>
                
                {condition.prevalenceInKenya && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">Prevalence:</span>
                    <span className="text-sm text-gray-800 text-right flex-1 ml-2">
                      {condition.prevalenceInKenya}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Emergency Care:</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    condition.isEmergency 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {condition.isEmergency ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            </div>

            {/* When to Seek Care Card */}
            <div className="medical-card p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                When to Seek Care
              </h3>
              
              <div className="space-y-3 text-sm">
                {condition.isEmergency ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-800 font-semibold mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Emergency - Call 999
                    </div>
                    <p className="text-red-700">Seek immediate medical attention</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-blue-800 font-semibold mb-1">
                      <Stethoscope className="w-4 h-4" />
                      Medical Consultation
                    </div>
                    <p className="text-blue-700">Consult with healthcare provider for proper care</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}