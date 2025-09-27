import { Metadata } from 'next';
import { fetchAPI } from '../utils/fetch-api';

interface DrugsPageProps {
  params: {
    lang: string;
  };
}

async function getDrugs() {
  try {
    const path = `/drugs-and-medications`;
    const urlParamsObject = {
      populate: '*',
      sort: 'name:asc',
    };

    const response = await fetchAPI(path, urlParamsObject);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching drugs:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Drugs & Medications - HealthierKE',
  description: 'Find information about medications, dosages, side effects, and drug interactions.',
};

export default async function DrugsPage({ params }: DrugsPageProps) {
  const drugs = await getDrugs();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Drugs & Medications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about medications, their uses, dosages, side effects, and important safety information.
          </p>
        </div>

        {drugs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drugs.map((drug: any) => {
              const name = drug.attributes?.name || drug.name;
              const description = drug.attributes?.description || drug.description;

              return (
                <div
                  key={drug.id}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-4">No medications found</h3>
            <p className="text-gray-600">Drug and medication information will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
