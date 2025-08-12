interface VideoEmbedProps {
  data: {
    id?: number;
    url?: string;
    videoUrl?: string;
    embedUrl?: string;
    width?: string;
    height?: string;
    title?: string;
  } | string;
}

const getEmbedUrl = (videoUrl: string): string | null => {
  if (!videoUrl) return null;
  
  // YouTube regex patterns
  const youtubeRegex =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|watch\?v%3D)([\w-]{11}).*/;
  const youtubeMatch = videoUrl.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${youtubeMatch[2]}?rel=0&modestbranding=1`;
  }

  // Vimeo support
  const vimeoRegex = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
  const vimeoMatch = videoUrl.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // If it's already an embed URL, return as is
  if (videoUrl.includes('embed') || videoUrl.includes('player')) {
    return videoUrl;
  }

  return null;
};

export default function VideoEmbed({ data }: VideoEmbedProps) {
  console.log("🎥 VideoEmbed Data:", data);
  
  // Handle different data structures
  let videoUrl = '';
  let title = 'Video';
  let width = '100%';
  let height = '100%';
  
  if (typeof data === 'string') {
    videoUrl = data;
  } else if (data && typeof data === 'object') {
    videoUrl = data.url || data.videoUrl || data.embedUrl || '';
    title = data.title || 'Video';
    width = data.width || '100%';
    height = data.height || '100%';
  }
  
  console.log("🎬 Video URL:", videoUrl);
  
  const embedUrl = getEmbedUrl(videoUrl);
  console.log("🔗 Embed URL:", embedUrl);

  if (!embedUrl) {
    return (
      <div className="medical-card p-8 text-center my-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="medical-text-muted">
          {videoUrl ? 'Invalid or unsupported video URL' : 'No video URL provided'}
        </p>
        {videoUrl && (
          <p className="text-sm text-gray-500 mt-2">URL: {videoUrl}</p>
        )}
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        <iframe
          title={title}
          src={embedUrl}
          width="100%"
          height="100%"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          loading="lazy"
        />
      </div>
      {title && title !== 'Video' && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
    </div>
  );
}
