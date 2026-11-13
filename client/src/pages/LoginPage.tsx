import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Signature DropyHub Side Rails */}
      <div className="dropy-side-rail-left" />
      <div className="dropy-side-rail-right" />

      {/* Subtle DropyHub Ambient Magenta Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-[#b6005d]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[420px] w-full relative z-20">
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/Dropyhub_logo.png"
              alt="DropyHub Logo"
              className="w-[88px] h-[54px] object-contain drop-shadow-xl"
            />
          </div>
          <span className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.14em] uppercase text-[#888888] font-medium mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-dropy-accentPink inline-block" />
            PARTNER OPERATIONS CONSOLE
          </span>
          <h1 className="text-3xl font-display font-extrabold tracking-[-0.03em] text-white uppercase mt-1">
            STAFF ACCESS
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-[#141414] border border-white/[0.08] rounded-2xl p-7 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Top signature gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-dropy-cta" />

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center space-x-2 font-body">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.12em] text-[#807f7f] mb-1.5 font-medium">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full dropy-input pl-10 pr-3.5 h-[46px] text-[13.5px] font-body text-white placeholder-[#666666]"
                  placeholder="name@dropyhub.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-[0.12em] text-[#807f7f] mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full dropy-input pl-10 pr-3.5 h-[46px] text-[13.5px] font-body text-white placeholder-[#666666]"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 h-[46px] rounded-[4px] bg-dropy-cta hover:bg-dropy-cta-hover text-white text-xs font-body font-bold uppercase tracking-[0.08em] flex items-center justify-center space-x-2 transition-all shadow-lg shadow-[#b6005d]/25 disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO COMMAND'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-[11px] text-[#807f7f] font-mono tracking-wider">
              Protected infrastructure for authorized DropyHub personnel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
