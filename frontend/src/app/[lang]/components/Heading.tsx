interface HeadingProps {
  data: {
    id?: string;
    heading?: string;
    description?: string;
    // Alternative property names that might be used
    title?: string;
    subtitle?: string;
    text?: string;
    content?: string;
    // Styling options
    level?: number;
    alignment?: string;
    size?: string;
    centered?: boolean;
  };
}

export default function Heading({ data }: HeadingProps) {
  const heading = data?.heading || data?.title;
  const description = data?.description || data?.subtitle || data?.text || data?.content;
  const level = data?.level || 2;
  const alignment = data?.alignment || 'left';
  const centered = data?.centered || alignment === 'center';

  if (!heading && !description) {
    return null;
  }

  // Determine heading tag based on level
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as keyof JSX.IntrinsicElements;

  // Determine text alignment classes
  const alignmentClass = centered || alignment === 'center' ? 'text-center' : 
                        alignment === 'right' ? 'text-right' : 'text-left';

  // Determine heading size based on level
  const getHeadingSize = (level: number) => {
    switch (level) {
      case 1: return 'text-3xl md:text-4xl lg:text-5xl';
      case 2: return 'text-2xl md:text-3xl lg:text-4xl';
      case 3: return 'text-xl md:text-2xl lg:text-3xl';
      case 4: return 'text-lg md:text-xl lg:text-2xl';
      case 5: return 'text-base md:text-lg lg:text-xl';
      case 6: return 'text-sm md:text-base lg:text-lg';
      default: return 'text-2xl md:text-3xl lg:text-4xl';
    }
  };

  return (
    <section className="webmd-section webmd-section-white">
      <div className="webmd-container">
        <div className={`webmd-section-header ${alignmentClass}`}>
          {heading && (
            <HeadingTag className={`webmd-section-title medical-text-primary font-bold leading-tight ${getHeadingSize(level)}`}>
              {heading}
            </HeadingTag>
          )}
          
          {description && (
            <p className="webmd-section-subtitle medical-text-secondary mt-4 leading-relaxed max-w-4xl">
              {description}
            </p>
          )}
          
          {/* Divider line - only show if we have content and it's not centered */}
          {(heading || description) && !centered && (
            <div className="webmd-section-divider-line mt-6"></div>
          )}
          
          {/* Centered divider for centered content */}
          {(heading || description) && centered && (
            <div className="webmd-section-divider-line mx-auto mt-6"></div>
          )}
        </div>
      </div>
    </section>
  );
}
