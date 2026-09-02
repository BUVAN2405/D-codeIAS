import React from 'react';
import { Wrench, Clock, Phone, MessageSquare, RefreshCw, ShieldCheck, FileText } from 'lucide-react';

interface MaintenancePageProps {
  estimatedTime?: string;
  onRefresh?: () => void;
}

export default function MaintenancePage({ estimatedTime = '30-45 minutes', onRefresh }: MaintenancePageProps) {
  const handleReload = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#061224] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10 bg-white/5 backdrop-blur-xl border border-white/15 p-8 md:p-12 rounded-3xl shadow-2xl text-center">
        {/* Animated Maintenance Icon Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold mb-6 shadow-inner animate-pulse">
          <Wrench className="w-10 h-10" />
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>Scheduled System Maintenance (HTTP 503)</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4 leading-tight">
          Upgrading Our Academic Portal
        </h1>

        <p className="text-slate-300 text-sm md:text-base mb-6 max-w-xl mx-auto leading-relaxed">
          D'code IAS Academy server infrastructure is undergoing essential database optimization and security updates to serve your UPSC preparation better.
        </p>

        {/* Estimated Completion Timer Card */}
        <div className="mb-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Estimated Resolution Time:</span>
          </div>
          <span className="font-bold text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-md border border-brand-gold/20 font-mono">
            ~{estimatedTime}
          </span>
        </div>

        {/* Direct Action & Contact Paths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <a
            href="tel:+919940376223"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-xs md:text-sm font-semibold text-white"
          >
            <Phone className="w-4 h-4 text-brand-gold" />
            Call Admissions: +91 99403 76223
          </a>
          <a
            href="https://wa.me/919940376223?text=Hi%20D'code%20IAS,%20I%20am%20inquiring%20during%20system%20maintenance."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 transition-all border border-emerald-500/30 text-xs md:text-sm font-semibold text-emerald-200"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            WhatsApp Urgent Support
          </a>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center gap-2.5 bg-brand-gold text-brand-navy font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Check Server Status Again
          </button>
        </div>
      </div>
    </div>
  );
}
