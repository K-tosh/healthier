'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FloatingTOCProps {
  headings: { title: string; id: string }[];
}

export default function FloatingTOC({ headings }: FloatingTOCProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          size="sm"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Desktop TOC */}
      <div className="hidden md:block fixed top-1/2 -translate-y-1/2 right-6 z-40 w-64">
        <div className="medical-card p-4 max-h-96 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-3 text-sm">Table of Contents</h3>
          <nav className="space-y-1">
            {headings.map(({ title, id }) => (
              <button
                key={id}
                onClick={() => scrollToHeading(id)}
                className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  activeHeading === id
                    ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile TOC Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-24 left-4 right-4 medical-card p-6 max-h-80 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
            <nav className="space-y-2">
              {headings.map(({ title, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToHeading(id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                    activeHeading === id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}