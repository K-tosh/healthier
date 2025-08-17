'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface NetworkStatusProps {
  className?: string;
}

export default function NetworkStatus({ className }: NetworkStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('');
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Get connection info if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection?.effectiveType || '');
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      // Hide status after 3 seconds
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    const handleConnectionChange = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        setConnectionType(connection?.effectiveType || '');
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('connection' in navigator) {
      (navigator as any).connection?.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        (navigator as any).connection?.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  // Don't show status if online and not explicitly showing
  if (isOnline && !showStatus) {
    return null;
  }

  const getConnectionIcon = () => {
    if (!isOnline) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      );
    }

    // Different icons based on connection type
    switch (connectionType) {
      case 'slow-2g':
      case '2g':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0" opacity={0.4} />
          </svg>
        );
      case '3g':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.929 12.929a7.5 7.5 0 0110.142 0" opacity={0.6} />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        );
    }
  };

  const getStatusMessage = () => {
    if (!isOnline) {
      return 'You are offline. Some features may not be available.';
    }
    
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      return 'Slow connection detected. Content may load slowly.';
    }
    
    return 'Back online!';
  };

  const getStatusColor = () => {
    if (!isOnline) {
      return 'bg-red-500 text-white';
    }
    
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      return 'bg-yellow-500 text-white';
    }
    
    return 'bg-green-500 text-white';
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300',
        getStatusColor(),
        showStatus ? 'translate-y-0' : '-translate-y-full',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {getConnectionIcon()}
      <span>{getStatusMessage()}</span>
      
      {/* Close button for persistent offline status */}
      {!isOnline && (
        <button
          onClick={() => setShowStatus(false)}
          className="ml-2 p-1 hover:bg-black/20 rounded transition-colors"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
