'use client';

import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  className?: string;
}

export default function ReadingProgress({ className = '' }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute top-full left-4 mt-2 bg-white shadow-lg rounded px-3 py-1 text-sm text-gray-600 opacity-90 transition-opacity duration-300"
           style={{ opacity: progress > 5 ? 1 : 0 }}>
        {Math.round(progress)}% read
      </div>
    </div>
  );
}