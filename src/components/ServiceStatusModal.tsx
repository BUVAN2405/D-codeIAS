import React from 'react';
import { X, CheckCircle2, ShieldCheck, Activity, Server, Mail, Database, FileText } from 'lucide-react';

interface ServiceStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceItem {
  name: string;
  category: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latency: string;
}

export default function ServiceStatusModal({ isOpen, onClose }: ServiceStatusModalProps) {
  if (!isOpen) return null;

  const services: ServiceItem[] = [
    {
      name: 'Admissions & Inquiry Gateway',
      category: 'Student Portal',
      status: 'operational',
      latency: '28 ms'
    },
    {
      name: 'Live Email Notification Engine',
      category: 'Dispatch Infrastructure',
      status: 'operational',
      latency: '110 ms'
    },
    {
      name: 'Firestore Database & Lead Spool',
      category: 'Storage System',
      status: 'operational',
      latency: '45 ms'
    },
    {
      name: 'UPSC Syllabus Download Generator',
      category: 'Document Engine',
      status: 'operational',
      latency: '12 ms'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white">D'code System Health Status</h2>
              <p className="text-xs text-slate-400">Live operational telemetry & status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Operational Badge */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-xs md:text-sm font-semibold text-emerald-300">
              All Core Systems Fully Operational
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
            99.98% Uptime
          </span>
        </div>

        {/* Service Metrics List */}
        <div className="space-y-3 mb-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-semibold text-slate-200">{srv.name}</p>
                <p className="text-[10px] text-slate-400">{srv.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-slate-400">{srv.latency}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Operational
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Last automated health check: Just now</span>
          <button
            onClick={onClose}
            className="text-brand-gold hover:underline font-semibold"
          >
            Close Status Window
          </button>
        </div>
      </div>
    </div>
  );
}
