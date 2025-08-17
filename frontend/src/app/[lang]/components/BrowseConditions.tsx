import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Condition {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface BrowseConditionsProps {
  conditions: Condition[];
  title?: string;
  description?: string;
}

export default function BrowseConditions({ 
  conditions, 
  title = "Browse Health Conditions",
  description = "Find information about various health conditions and medical topics."
}: BrowseConditionsProps) {
  if (!conditions || conditions.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 mb-8">{description}</p>
            <p className="text-gray-500">No conditions available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conditions.map((condition) => (
            <Card key={condition.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  <Link 
                    href={`/conditions/${condition.slug}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {condition.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              {condition.description && (
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {condition.description.length > 120 
                      ? `${condition.description.substring(0, 120)}...` 
                      : condition.description
                    }
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/conditions"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Conditions
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
