import { Metadata } from 'next';

interface WellnessPageProps {
  params: {
    lang: string;
  };
}

export const metadata: Metadata = {
  title: 'Wellness & Lifestyle - HealthierKE',
  description: 'Discover wellness tips, lifestyle advice, and healthy living strategies for better health.',
};

export default async function WellnessPage({ params }: WellnessPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wellness & Lifestyle</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore wellness tips, healthy lifestyle choices, and strategies for optimal health and well-being.
          </p>
        </div>

        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Coming Soon</h3>
          <p className="text-gray-600">Wellness and lifestyle content will be available soon.</p>
        </div>
      </div>
    </div>
  );
}
