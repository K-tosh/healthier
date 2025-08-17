import { Metadata } from 'next';
import Link from 'next/link';
import { fetchAPI } from '../utils/fetch-api';

interface ConditionsPageProps {
  params: {
    lang: string;
  };
}

async function getConditions() {
  try {
    const path = `/conditions`;
    const urlParamsObject = {
      populate: 'deep',
      sort: 'name:asc',
    };

    const response = await fetchAPI(path, urlParamsObject);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Health Conditions - HealthierKE',
  description: 'Browse comprehensive information about various health conditions and medical topics.',
};

export default async function ConditionsPage({ params }: ConditionsPageProps) {
  const conditions = await getConditions();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Conditions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about various health conditions, their symptoms, treatments, and prevention strategies.
          </p>
        </div>

        {conditions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conditions.map((condition: any) => {
              const name = condition.attributes?.name || condition.name;
              const slug = condition.attributes?.slug || condition.slug;
              const description = condition.attributes?.description || condition.description;

              return (
                <Link
                  key={condition.id}
                  href={`/${params.lang}/conditions/${slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{name}</h3>
                  {description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {description.length > 120 
                        ? `${description.substring(0, 120)}...` 
                        : description
                      }
                    </p>
                  )}
                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    Learn more →
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-4">No conditions found</h3>
            <p className="text-gray-600">Health condition information will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
