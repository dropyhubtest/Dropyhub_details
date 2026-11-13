import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ArrowUpRight, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full h-[88px] bg-[#0c0c0c]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center transition-all">
      <div className="w-full max-w-[1360px] mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Brand Logo & Context */}
        <div className="flex items-center space-x-6">
          <a href="/" className="flex items-center space-x-3.5 group">
            <img
              src="/Dropyhub_logo.png"
              alt="DropyHub Logo"
              className="w-[88px] h-[54px] object-contain group-hover:brightness-110 transition-all"
            />
            <div className="hidden sm:block border-l border-white/10 pl-3.5">
              <span className="text-[10px] font-mono tracking-[0.14em] uppercase text-[#888888] block font-medium">
                OPERATIONS CONSOLE
              </span>
              <span className="text-xs font-display font-bold text-white tracking-wide uppercase">
                PARTNER PLATFORM
              </span>
            </div>
          </a>
        </div>

        {/* Navigation Items & Actions */}
        {user && (
          <div className="flex items-center space-x-5">
            {/* Live Website Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center space-x-1.5 text-[14px] font-body font-medium text-[#a3a3a3] hover:text-white transition-colors tracking-[0.04em]"
            >
              <span>dropyhub.com</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-dropy-accentPink" />
            </a>

            {/* Staff User Capsule */}
            <div className="flex items-center space-x-2.5 bg-[#171717] border border-[#272727] px-3.5 py-1.5 rounded-[6px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 dropy-pulse-dot" />
              <span className="text-xs font-body font-medium text-dropy-textSecondary">
                {user.email}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                {user.role}
              </span>
            </div>

            {/* Sign Out Button matching Figma Button style */}
            <button
              onClick={() => logout()}
              className="inline-flex items-center justify-center h-[38px] px-5 bg-[#272727] hover:bg-[#333333] text-white text-[13px] font-body font-semibold tracking-[0.05em] uppercase rounded-[4px] border border-white/[0.08] transition-all duration-150 space-x-2"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#888888]" />
              <span>LOGOUT</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
