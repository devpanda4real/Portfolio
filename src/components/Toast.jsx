import React from 'react';
import { Info } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      id="toast"
      className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 border border-cyan-500/30 text-white text-xs font-mono shadow-2xl flex items-center gap-2.5 transition-all duration-300 transform translate-y-0 opacity-100 backdrop-blur-md"
    >
      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
        <Info className="w-3.5 h-3.5" />
      </div>
      <span id="toast-message">{message}</span>
    </div>
  );
}
