'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RichText from '../RichText';
import { 
  FileText, 
  Activity, 
  Pill, 
  Shield, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface MedicalTabsProps {
  condition: {
    name: string;
    description?: string;
    overview?: string;
    isEmergency: boolean;
    prevalenceInKenya?: string;
  };
  relatedArticles?: any[];
  symptoms?: any[];
  treatments?: any[];
}

const tabsConfig = [
  {
    id: 'overview',
    label: 'Overview',
    icon: FileText,
    description: 'Essential information about this condition'
  },
  {
    id: 'symptoms',
    label: 'Symptoms',
    icon: Activity,
    description: 'Signs and symptoms to watch for'
  },
  {
    id: 'treatment',
    label: 'Treatment',
    icon: Pill,
    description: 'Treatment options and management'
  },
  {
    id: 'prevention',
    label: 'Prevention',
    icon: Shield,
    description: 'Prevention and lifestyle tips'
  }
];

export default function MedicalTabs({ condition, relatedArticles = [], symptoms = [], treatments = [] }: MedicalTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <section className="healthier-section healthier-section-white">
      <div className="content-container">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Professional Sticky Tab Navigation */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 mb-8">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-max bg-transparent border-0 p-0">
                {tabsConfig.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 px-6 py-4 border-b-2 border-transparent transition-all duration-200 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 hover:text-blue-500 hover:border-blue-300 bg-transparent rounded-none"
                    >
                      <Icon className="w-4 h-4" />
                      <div className="text-sm font-medium whitespace-nowrap">
                        {tab.label}
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8 mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="medical-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Overview
                </h3>
                <div className="text-gray-600">
                  <p className="mb-4">{condition.description}</p>
                  {condition.prevalenceInKenya && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Prevalence in Kenya</h4>
                      <p className="text-blue-700 text-sm">{condition.prevalenceInKenya}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Overview Articles */}
              {relatedArticles.length > 0 && (
                <div className="medical-card p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Related Articles
                  </h3>
                  <div className="grid gap-4">
                    {relatedArticles.slice(0, 6).map((article) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.attributes?.category?.data?.attributes?.slug || 'health'}/${article.attributes.slug}`}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{article.attributes.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{article.attributes.description}</p>
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          Read Article <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Symptoms Tab */}
          <TabsContent value="symptoms" className="space-y-8 mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
              {symptoms.length > 0 ? (
                <div className="medical-card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    Common Symptoms
                  </h3>
                  <div className="grid gap-4">
                    {symptoms.map((symptom, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{symptom.name || symptom.attributes?.name}</h4>
                        <div className="text-gray-600" dangerouslySetInnerHTML={{ 
                          __html: symptom.description || symptom.attributes?.description || ''
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="medical-card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    Symptoms & Signs
                  </h3>
                  <div className="text-gray-600">
                    <p>No symptoms data available for {condition.name}. Consult with a healthcare professional for detailed symptom information.</p>
                    
                    {condition.isEmergency && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800 text-sm font-semibold mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Emergency Condition</span>
                        </div>
                        <p className="text-red-700 text-sm">This is considered an emergency condition. Seek immediate medical attention if you suspect {condition.name}.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Treatment Tab */}
          <TabsContent value="treatment" className="space-y-8 mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
              {treatments.length > 0 ? (
                <div className="medical-card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-600" />
                    Treatment Options
                  </h3>
                  <div className="grid gap-4">
                    {treatments.map((treatment, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{treatment.name || treatment.attributes?.name}</h4>
                        <div className="text-gray-600 mb-3" dangerouslySetInnerHTML={{ 
                          __html: treatment.description || treatment.attributes?.description || ''
                        }} />
                        <div className="flex flex-wrap gap-2">
                          {(treatment.availableInKenya !== undefined || treatment.attributes?.availableInKenya !== undefined) && (
                            <Badge className={`${(treatment.availableInKenya || treatment.attributes?.availableInKenya) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {(treatment.availableInKenya || treatment.attributes?.availableInKenya) ? '✓ Available in Kenya' : '✗ Limited Availability'}
                            </Badge>
                          )}
                          {(treatment.type || treatment.attributes?.type) && (
                            <Badge variant="outline">{treatment.type || treatment.attributes?.type}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="medical-card p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-600" />
                    Treatment & Management
                  </h3>
                  <div className="text-gray-600">
                    <p className="mb-4">No treatment data available for {condition.name}. Consult with a healthcare professional for personalized treatment advice.</p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-yellow-800 text-sm font-semibold mb-2">
                        <Pill className="w-4 h-4" />
                        <span>Important Note</span>
                      </div>
                      <p className="text-yellow-700 text-sm">Always seek professional medical advice for proper diagnosis and treatment of {condition.name}.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Prevention Tab */}
          <TabsContent value="prevention" className="space-y-8 mt-0">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="medical-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Prevention & Lifestyle
                </h3>
                <div className="text-gray-600">
                  <p className="mb-4">No prevention data available for {condition.name}. Consult with healthcare professionals for prevention strategies.</p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 text-sm font-semibold mb-2">
                      <Shield className="w-4 h-4" />
                      <span>General Health Note</span>
                    </div>
                    <p className="text-blue-700 text-sm">Maintain regular health check-ups and follow medical advice for {condition.name}.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}