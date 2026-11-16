import React, { useState, useEffect } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { profileData } from '../data/profile.js';

export default function Navbar({ onOpenAdmin }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Scroll Progress Bar */}
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Top Header / Brand Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-nav transition-all duration-300" id="header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 py-3 sm:py-4 flex items-center justify-between">
          {/* Brand Monogram & Name */}
          <a href="#hero" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/50 transition-all duration-300">
                <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm text-white font-mono tracking-tighter">
                  {profileData.initials}
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-dark-950 rounded-full animate-ping" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-dark-950 rounded-full" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white text-sm sm:text-base tracking-tight group-hover:text-cyan-400 transition-colors block truncate">
                {profileData.name}
              </span>
              <span className="block text-[11px] sm:text-xs text-slate-400 font-mono truncate">
                {profileData.degree.replace('in ', '')} @ SLTC
              </span>
            </div>
          </a>

          {/* Navigation Links & Action */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <nav className="hidden md:flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10 shadow-inner text-xs font-mono">
              <a href="#about" className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <span>About</span>
              </a>
              <a href="#skills" className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <span>Skills</span>
              </a>
              <a href="#projects" className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <span>Projects</span>
              </a>
              <a href="#experience" className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <span>Experience</span>
              </a>
              <a href="#interactive-hub" className="px-3 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                <span>Terminal</span>
              </a>
            </nav>

            <a
              href={profileData.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all shadow-sm"
              title="GitHub — devpanda4real"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </a>

            {/* Contact CTA */}
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contact</span>
            </a>

            {/* Subtle Super Admin Shield Button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-400 hover:bg-white/5 transition-colors cursor-pointer"
              title="Super Admin Privacy Controls"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
