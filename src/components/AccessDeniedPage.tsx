import React from 'react';
import { ShieldAlert, Lock, Home, KeyRound } from 'lucide-react';

interface AccessDeniedPageProps {
  onGoHome?: () => void;
  onOpenLogin?: () => void;
}

export default function AccessDeniedPage({ onGoHome, onOpenLogin }: AccessDeniedPageProps) {
  return (
    <div className="min-h-screen bg-[#0F0816] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/15 p-8 rounded-3xl shadow-2xl text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 mb-6 shadow-inner">
          <Lock className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security Notice (HTTP 401 / 403)</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
          Restricted Administrative Access
        </h1>

        <p className="text-slate-300 text-xs md:text-sm mb-8 leading-relaxed">
          You do not have active session privileges to view this administrative page or lead export module. Please authenticate with valid administrator credentials.
        </p>

        <div className="flex flex-col gap-3">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold px-5 py-3 rounded-xl text-sm hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/15"
            >
              <KeyRound className="w-4 h-4" />
              Authenticate Administrator Account
            </button>
          )}
          <button
            onClick={() => (onGoHome ? onGoHome() : (window.location.href = '/'))}
            className="w-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-xl text-sm transition-all border border-white/10"
          >
            <Home className="w-4 h-4" />
            Return to Academy Main Site
          </button>
        </div>
      </div>
    </div>
  );
}
