import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface ErrorPageProps {
  error?: Error | null;
  resetError?: () => void;
}

export default function ErrorPage({ error, resetError }: ErrorPageProps) {
  const handleReload = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-lg">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
          Application Exception Intercepted
        </h1>

        <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
          We encountered an unexpected rendering error while processing this section. Your lead inputs and saved sessions remain intact.
        </p>

        {/* Technical Error accordion if details present */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-40">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5 font-sans">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Trace Diagnostic:</span>
            </div>
            <p className="whitespace-pre-wrap leading-tight">{error.message || String(error)}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleReload}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold px-5 py-3 rounded-lg text-sm hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/10"
          >
            <RefreshCw className="w-4 h-4" />
            Reload & Recover View
          </button>
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-medium px-5 py-3 rounded-lg text-sm transition-colors border border-slate-600"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
