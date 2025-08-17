'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface PerformanceMonitorProps {
  className?: string;
  onPerformanceData?: (data: PerformanceData) => void;
  enabled?: boolean; // Allow explicit control
}

interface PerformanceData {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  connectionType?: string;
  isSlowConnection: boolean;
}

export default function PerformanceMonitor({ 
  className, 
  onPerformanceData,
  enabled = false // Default to disabled
}: PerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lcpValue = 0;
    let fidValue = 0;
    let clsValue = 0;

    // Create performance observer for Core Web Vitals
    const observePerformance = () => {
      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcpValue = lastEntry.startTime;
            updatePerformanceData();
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              fidValue = entry.processingStart - entry.startTime;
              updatePerformanceData();
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                updatePerformanceData();
              }
            });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('Performance Observer not fully supported:', error);
        }
      }
    };

    const updatePerformanceData = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const ttfb = navigation ? navigation.responseStart - navigation.requestStart : 0;

      // Get connection info
      const connection = (navigator as any)?.connection;
      const connectionType = connection?.effectiveType || 'unknown';
      const isSlowConnection = ['slow-2g', '2g'].includes(connectionType);

      const data: PerformanceData = {
        lcp: lcpValue,
        fid: fidValue,
        cls: clsValue,
        ttfb,
        fcp,
        connectionType,
        isSlowConnection
      };

      setPerformanceData(data);
      onPerformanceData?.(data);

      // Show alert for poor performance
      const isPoorPerformance = lcpValue > 4000 || fidValue > 300 || clsValue > 0.25;
      if (isPoorPerformance && !showAlert) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }
    };

    // Start observing after a short delay
    const timeout = setTimeout(observePerformance, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [onPerformanceData, showAlert]);

  // Only show in development mode - multiple checks to ensure it's hidden in production
  if (!enabled ||
      process.env.NODE_ENV === 'production' || 
      process.env.NEXT_PUBLIC_NODE_ENV === 'production' ||
      typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return null;
  }

  if (!performanceData) {
    return null;
  }

  const getPerformanceGrade = () => {
    const { lcp, fid, cls } = performanceData;
    
    let score = 0;
    
    // LCP scoring
    if (lcp <= 2500) score += 33;
    else if (lcp <= 4000) score += 16;
    
    // FID scoring
    if (fid <= 100) score += 33;
    else if (fid <= 300) score += 16;
    
    // CLS scoring
    if (cls <= 0.1) score += 34;
    else if (cls <= 0.25) score += 17;
    
    if (score >= 90) return { grade: 'A', color: 'text-green-600' };
    if (score >= 75) return { grade: 'B', color: 'text-yellow-600' };
    if (score >= 60) return { grade: 'C', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getPerformanceGrade();

  return (
    <>
      {/* Performance Badge (Development Only) */}
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs font-mono',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('w-2 h-2 rounded-full', {
            'bg-green-500': grade === 'A',
            'bg-yellow-500': grade === 'B',
            'bg-orange-500': grade === 'C',
            'bg-red-500': grade === 'F'
          })} />
          <span className={cn('font-bold', color)}>Performance: {grade}</span>
        </div>
        
        <div className="space-y-1 text-gray-600">
          <div>LCP: {Math.round(performanceData.lcp)}ms</div>
          <div>FID: {Math.round(performanceData.fid)}ms</div>
          <div>CLS: {performanceData.cls.toFixed(3)}</div>
          <div>TTFB: {Math.round(performanceData.ttfb)}ms</div>
          {performanceData.connectionType && (
            <div>Net: {performanceData.connectionType}</div>
          )}
        </div>
      </div>

      {/* Performance Alert */}
      {showAlert && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800">Performance Issue Detected</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {performanceData.isSlowConnection 
                  ? 'Slow connection detected. Content is optimized for your network speed.'
                  : 'Page performance could be improved. Some content may load slowly.'
                }
              </p>
              {performanceData.isSlowConnection && (
                <div className="mt-2 text-xs text-yellow-600">
                  <div>• Images are being compressed</div>
                  <div>• Non-essential content is deferred</div>
                  <div>• Offline mode is available</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
