import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Landmark } from 'lucide-react';
import LogoImage from '../LOGO.jpeg';
import { adminLoginApi } from '../services/api';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export default function AdminLoginPage({ onLoginSuccess, onBackToHome }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await adminLoginApi(email, password);
    setLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setError(res.error || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061426] via-[#0D2C54] to-[#163E72] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-white">
      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-space font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/15"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Secure Admin Portal</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 text-gray-900"
        >
          {/* Logo & Academy Title */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0D2C54] p-1 shadow-lg shadow-black/10 flex items-center justify-center">
              <img
                src={LogoImage}
                alt="D'code IAS Academy Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0D2C54] tracking-tight">
              Administrator Login
            </h1>
            <p className="text-xs text-gray-500 font-sans">
              Sign in to manage student inquiries, registrations, and batch schedules.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 font-space">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@decodeias.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 font-space">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/20 focus:border-[#0D2C54] bg-[#F8FAFC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#0D2C54] hover:bg-[#D31218] text-white font-space text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Open Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Help Info */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-400 space-y-1">
            <p>Authorized administration staff only.</p>
            <p className="font-mono text-[10px]">D'code IAS Academy • Chennai</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 py-3 font-space">
        © {new Date().getFullYear()} D'code IAS Academy. Internal Administrator Access.
      </footer>
    </div>
  );
}
