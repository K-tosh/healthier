import { getStrapiMedia } from "../utils/api-helpers";

interface LargeVideoProps {
  data: {
    id?: string;
    heading?: string;
    description?: string;
    video?: {
      data?: {
        attributes?: {
          url?: string;
          name?: string;
          alternativeText?: string;
        };
      };
    };
    // Alternative property names that might be used
    title?: string;
    subtitle?: string;
    videoFile?: any;
    media?: any;
    // Video URL as string
    videoUrl?: string;
    youtubeUrl?: string;
    embedUrl?: string;
  };
}

export default function LargeVideo({ data }: LargeVideoProps) {
  const heading = data?.heading || data?.title;
  const description = data?.description || data?.subtitle;
  
  // Get video URL from various possible sources
  let videoUrl: string | null = data?.videoUrl || data?.youtubeUrl || data?.embedUrl || null;
  
  // Check if video is from Strapi media
  if (!videoUrl && data?.video?.data?.attributes?.url) {
    const strapiUrl = getStrapiMedia(data.video.data.attributes.url);
    videoUrl = strapiUrl || null;
  }
  
  // Check alternative media fields
  if (!videoUrl && data?.videoFile?.data?.attributes?.url) {
    const strapiUrl = getStrapiMedia(data.videoFile.data.attributes.url);
    videoUrl = strapiUrl || null;
  }
  
  if (!videoUrl && data?.media?.data?.attributes?.url) {
    const strapiUrl = getStrapiMedia(data.media.data.attributes.url);
    videoUrl = strapiUrl || null;
  }

  // Extract video ID from YouTube URLs
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Check if it's a YouTube URL
  const isYouTubeUrl = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
  const youtubeVideoId = isYouTubeUrl && videoUrl ? getYouTubeVideoId(videoUrl) : null;

  if (!videoUrl) {
    return (
      <section className="healthier-section healthier-section-white">
        <div className="healthier-container">
          <div className="text-center py-8">
            <p className="medical-text-muted">No video available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="healthier-section healthier-section-light">
      <div className="healthier-container">
        {/* Header */}
        {(heading || description) && (
          <div className="healthier-section-header">
            {heading && (
              <h2 className="healthier-section-title medical-text-primary">
                {heading}
              </h2>
            )}
            {description && (
              <p className="healthier-section-subtitle medical-text-secondary">
                {description}
              </p>
            )}
            <div className="healthier-section-divider-line"></div>
          </div>
        )}

        {/* Video Container */}
        <div className="mt-12">
          <div className="medical-card p-6">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
              {youtubeVideoId ? (
                // YouTube embed
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&showinfo=0`}
                  title={heading || "Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    boxShadow: 'var(--medical-shadow-lg)',
                    border: '1px solid var(--medical-border-light)'
                  }}
                />
              ) : videoUrl && videoUrl.includes('vimeo.com') ? (
                // Vimeo embed (extract video ID)
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}?byline=0&portrait=0`}
                  title={heading || "Video"}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{
                    boxShadow: 'var(--medical-shadow-lg)',
                    border: '1px solid var(--medical-border-light)'
                  }}
                />
              ) : videoUrl ? (
                // Direct video file
                <video
                  className="absolute top-0 left-0 w-full h-full rounded-lg object-cover"
                  controls
                  preload="metadata"
                  style={{
                    boxShadow: 'var(--medical-shadow-lg)',
                    border: '1px solid var(--medical-border-light)'
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                  <source src={videoUrl} type="video/webm" />
                  <source src={videoUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // Fallback when no valid video URL
                <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="medical-text-muted">Video not available</p>
                  </div>
                </div>
              )}
              
              {/* Loading overlay for better UX */}
              <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 border-4 border-medical-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="medical-text-secondary">Loading video...</span>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm medical-text-muted">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>HD Quality</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                  <span>Responsive Player</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Streaming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
