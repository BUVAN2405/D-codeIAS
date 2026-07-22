import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { adminLoginApi } from '../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await adminLoginApi(email, password);
    setLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        {/* Backdrop */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-[#0D2C54] text-white rounded-3xl shadow-2xl overflow-hidden border border-white/15 z-10"
        >
          {/* Top Decorative Header */}
          <div className="p-6 bg-gradient-to-r from-[#0D2C54] via-[#163e72] to-[#0D2C54] border-b border-white/10 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#D31218]/20 border border-[#D31218]/40 rounded-2xl text-[#D31218]">
                <ShieldCheck className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Owner Dashboard Access
                </h3>
                <p className="font-space text-[10px] text-gray-300 uppercase tracking-widest mt-0.5">
                  D'code IAS Academy • Admin Portal
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-200 text-xs font-sans">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-space text-[10px] uppercase font-bold tracking-wider text-gray-300">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter admin email address"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#D31218] focus:bg-white/10 text-white text-sm rounded-xl pl-10 pr-4 py-3 outline-none transition-all placeholder:text-gray-500 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block font-space text-[10px] uppercase font-bold tracking-wider text-gray-300">
                Static Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter static admin password"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#D31218] focus:bg-white/10 text-white text-sm rounded-xl pl-10 pr-11 py-3 outline-none transition-all placeholder:text-gray-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#D31218] hover:bg-[#A30D12] disabled:opacity-50 text-white font-space text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-lg shadow-black/20 cursor-pointer flex items-center justify-center gap-2 border-none"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate & Open Dashboard
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="p-4 bg-black/20 border-t border-white/10 text-center text-[10px] font-space text-gray-400 uppercase tracking-widest">
            Protected Database Portal • D'code IAS
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
