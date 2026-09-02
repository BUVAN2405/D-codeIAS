import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function NetworkStatusOverlay() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const [reconnectedMessage, setReconnectedMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (wasOffline) {
        setReconnectedMessage(true);
        setTimeout(() => setReconnectedMessage(false), 4000);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (!isOffline && !reconnectedMessage) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {isOffline ? (
        <div className="bg-rose-600 text-white px-4 py-2.5 shadow-xl flex items-center justify-between text-xs md:text-sm font-medium animate-pulse">
          <div className="flex items-center gap-2.5 max-w-(--size-container-max) mx-auto w-full">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>
              <strong>Network Disconnected:</strong> You are currently offline. Any inquiry forms submitted will be queued safely in your browser storage and synced automatically once your connection recovers.
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-xs ml-4 flex-shrink-0 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry
          </button>
        </div>
      ) : reconnectedMessage ? (
        <div className="bg-emerald-600 text-white px-4 py-2.5 shadow-xl flex items-center justify-center text-xs md:text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Internet Connection Restored! Your browser is back online.</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
