import React from 'react';
import { profileData } from '../data/profile.js';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 text-center text-xs sm:text-sm text-slate-400 font-mono">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>
            {profileData.name} &bull; {profileData.location.split(',')[0]}, Sri Lanka
          </span>
        </div>
        <div>Built with React, Vite &amp; Tailwind CSS &bull; Modular Architecture</div>
        <div>
          &copy; <span id="year">{new Date().getFullYear()}</span> All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
