import { motion } from 'motion/react';
import { BatchSchedule } from '../types';
import { Calendar, Users, ShieldAlert, CheckCircle, Flame, MapPin, XCircle } from 'lucide-react';

interface BatchScheduleProps {
  batches: BatchSchedule[];
  onEnrollClick: (batch: BatchSchedule) => void;
}

export default function BatchSchedulesList({ batches, onEnrollClick }: BatchScheduleProps) {
  
  // Custom styled badge color resolvers for Commute Mode tags
  const getModeStyles = (mode: string) => {
    switch (mode) {
      case 'Offline + Online':
        return 'bg-[#e1e0ff] text-[#404176] border border-[#c1c1ff]/50';
      case 'Online Exclusive':
        return 'bg-[#edf5fa] text-[#40484c] border border-[#c0c8cc]/50';
      case 'Offline Only':
        return 'bg-[#fff2e0] text-[#776e5f] border border-[#ede1cf]/50';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Custom styled badge color for Availability tags
  const getAvailabilityStyles = (availability: string) => {
    switch (availability) {
      case 'Limited Seats':
        return 'text-[#665d4f] font-semibold bg-[#fff2e0]/80 border border-[#ede1cf]';
      case 'Open':
        return 'text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100';
      case 'Last 5 Seats':
        return 'text-rose-700 font-semibold bg-rose-50 border border-rose-100 animate-pulse';
      case 'Coming Soon':
        return 'text-amber-700 font-semibold bg-amber-50 border border-amber-100';
      case 'Closed':
        return 'text-[#93000a] font-semibold bg-rose-50 border border-rose-100';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <section className="py-20 bg-surface-cream/50 border-b border-brand-violet/10">
      <div className="max-w-(--size-container-max) mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-space text-xs font-bold uppercase tracking-widest text-brand-violet block mb-2">
            Admissions Timeline
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-accent tracking-tight">
            Upcoming Batch Schedule
          </h2>
          <div className="w-16 h-0.5 bg-brand-violet/30 mx-auto mt-4" />
        </div>

        {/* Tabular Schedule Content for Desktop Devices */}
        <div className="hidden md:block overflow-hidden bg-white border border-brand-violet/10 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-violet/5 border-b border-brand-violet/15 text-[10px] font-space tracking-wider uppercase text-brand-accent/80 font-bold">
                <th className="py-4 px-6">Batch Name</th>
                <th className="py-4 px-6">Start Date</th>
                <th className="py-4 px-6">Mode</th>
                <th className="py-4 px-6">Availability</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-violet/5">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-brand-violet/1 transition-all">
                  
                  {/* Batch Name */}
                  <td className="py-5 px-6">
                    <div className="font-serif font-bold text-brand-accent text-sm">
                      {batch.name}
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="py-5 px-6">
                    <div className="font-sans text-xs text-[#000000] font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-violet/60" />
                      {batch.startDate}
                    </div>
                  </td>

                  {/* Mode Tag */}
                  <td className="py-5 px-6">
                    <span className={`inline-block font-space text-[10px] uppercase font-semibold px-2.5 py-1 rounded ${getModeStyles(batch.mode)}`}>
                      {batch.mode}
                    </span>
                  </td>

                  {/* Availability Badge */}
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1 font-sans text-xs px-2.5 py-0.5 rounded border ${getAvailabilityStyles(batch.availability)}`}>
                      {batch.availability === 'Last 5 Seats' && <Flame className="w-3.5 h-3.5 text-rose-500" />}
                      {batch.availability === 'Limited Seats' && <ShieldAlert className="w-3.5 h-3.5 text-brand-primary" />}
                      {batch.availability === 'Open' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                      {batch.availability === 'Coming Soon' && <Calendar className="w-3.5 h-3.5 text-amber-500" />}
                      {batch.availability === 'Closed' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {batch.availability}
                    </span>
                  </td>

                  {/* Action CTA Trigger */}
                  <td className="py-5 px-6 text-right">
                    <button
                      onClick={() => onEnrollClick(batch)}
                      className="inline-flex items-center text-xs font-space font-bold uppercase tracking-wider text-brand-violet hover:text-brand-accent px-4 py-2 border border-brand-violet/20 hover:border-brand-violet/60 hover:bg-brand-violet/5 rounded transition-all cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Responsive Mobile Layout Cards */}
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {batches.map((batch) => (
            <motion.div
              key={batch.id}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-lg p-5 border border-brand-violet/10 space-y-4 shadow-xs"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-serif font-bold text-base text-brand-accent">
                  {batch.name}
                </h3>
                <span className={`inline-block font-space text-[9px] uppercase font-semibold px-2.5 py-1 rounded ${getModeStyles(batch.mode)}`}>
                  {batch.mode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-sans pb-4 border-b border-brand-violet/5">
                <div>
                  <p className="font-space text-[9px] uppercase text-gray-400">Commencing</p>
                  <p className="font-semibold text-brand-accent mt-0.5">{batch.startDate}</p>
                </div>
                <div>
                  <p className="font-space text-[9px] uppercase text-gray-400 font-semibold">Availability</p>
                  <span className={`inline-block font-semibold text-[11px] mt-0.5 px-2 rounded ${getAvailabilityStyles(batch.availability)}`}>
                    {batch.availability}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => onEnrollClick(batch)}
                  className="w-2/3 max-w-[180px] mx-auto block text-center bg-brand-violet hover:bg-brand-violet/95 text-white font-space text-xs font-bold uppercase tracking-wider py-2.5 rounded transition-all cursor-pointer shadow-xs"
                >
                  Enroll Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
