import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAPI } from '../../utils/fetch-api';

interface ConditionPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

async function getCondition(slug: string) {
  try {
    const path = `/conditions`;
    const urlParamsObject = {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        icon: true,
        articles: {
          populate: {
            cover: true,
            category: true,
            authorsBio: true,
          }
        },
        seo: true,
      },
    };

    const response = await fetchAPI(path, urlParamsObject);
    return response.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching condition:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ConditionPageProps): Promise<Metadata> {
  const condition = await getCondition(params.slug);
  
  if (!condition) {
    return {
      title: 'Condition Not Found',
    };
  }

  const title = condition.attributes?.name || condition.name || 'Health Condition';
  const description = condition.attributes?.description || condition.description;

  return {
    title: `${title} - HealthierKE`,
    description,
  };
}

export default async function ConditionPage({ params }: ConditionPageProps) {
  const condition = await getCondition(params.slug);

  if (!condition) {
    notFound();
  }

  const name = condition.attributes?.name || condition.name;
  const description = condition.attributes?.description || condition.description;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{name}</h1>
        {description && (
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
