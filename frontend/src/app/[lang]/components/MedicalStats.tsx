"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface MedicalStatsProps {
  stats?: StatItem[];
  showStats?: boolean;
  className?: string;
}

export default function MedicalStats({ 
  stats,
  showStats = true,
  className = ""
}: MedicalStatsProps) {
  const [dynamicStats, setDynamicStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Strapi
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch actual data from your Strapi backend
        const [conditionsRes, articlesRes] = await Promise.allSettled([
          fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}/api/conditions`),
          fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}/api/articles`)
        ]);

        const conditionsData = conditionsRes.status === 'fulfilled' && conditionsRes.value.ok 
          ? await conditionsRes.value.json() 
          : null;
        
        const articlesData = articlesRes.status === 'fulfilled' && articlesRes.value.ok 
          ? await articlesRes.value.json() 
          : null;

        const realStats: StatItem[] = [];

        // Only show stats if we have real data
        if (conditionsData?.data?.length > 0) {
          realStats.push({
            value: `${conditionsData.data.length}+`,
            label: "Health Conditions",
            icon: "🏥",
            color: "from-blue-500 to-blue-600"
          });

          // Count emergency conditions
          const emergencyConditions = conditionsData.data.filter((c: any) => c.isEmergency);
          if (emergencyConditions.length > 0) {
            realStats.push({
              value: `${emergencyConditions.length}`,
              label: "Emergency Conditions",
              icon: "🚨",
              color: "from-red-500 to-red-600"
            });
          }
        }

        if (articlesData?.data?.length > 0) {
          realStats.push({
            value: `${articlesData.data.length}+`,
            label: "Health Articles",
            icon: "📚",
            color: "from-green-500 to-green-600"
          });
        }

        // Add Kenya-focused stat if we have prevalence data
        if (conditionsData?.data?.some((c: any) => c.prevalenceInKenya)) {
          realStats.push({
            value: "🇰🇪",
            label: "Kenya Focused",
            icon: "🌍",
            color: "from-purple-500 to-purple-600"
          });
        }

        setDynamicStats(realStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setDynamicStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (showStats && !stats) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [stats, showStats]);

  // Use provided stats or dynamic stats
  const displayStats = stats || dynamicStats;

  // Don't render if no stats or loading
  if (!showStats || (isLoading && !stats) || displayStats.length === 0) {
    return null;
  }

  return (
    <section className={`healthier-section healthier-section-alt ${className}`}>
      <div className="content-container">
        <div className="healthier-section-header text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              📊
            </div>
          </div>
          <h2 className="healthier-section-title">
            Health Information at Your Fingertips
          </h2>
          <div className="healthier-section-divider-line mx-auto"></div>
          <p className="healthier-section-subtitle max-w-2xl mx-auto">
            Access comprehensive health information tailored for Kenya's healthcare landscape.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {displayStats.map((stat, index) => (
            <Card key={index} className="text-center healthier-card-feature hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
