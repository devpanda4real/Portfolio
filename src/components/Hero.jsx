import React from 'react';
import {
  Cloud,
  Server,
  Network,
  MapPin,
  GraduationCap,
  Globe,
  ArrowUpRight,
  FolderGit2,
  Send,
  Copy
} from 'lucide-react';
import { profileData } from '../data/profile.js';

export default function Hero({ onCopyEmail }) {
  return (
    <section
      id="hero"
      className="relative w-full min-w-0 max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-20 lg:pt-16 lg:pb-28 flex flex-col items-center text-center"
    >
      {/* Status Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono font-medium shadow-lg shadow-cyan-500/10 mb-4 animate-float max-w-full">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="truncate">{profileData.statusBadge}</span>
      </div>

      {/* Cloud Infrastructure Telemetry Ribbon */}
      <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-xs font-mono w-full max-w-xs sm:max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/25 text-cyan-300 shadow-sm shadow-cyan-500/10">
          <Cloud className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>
            Cloud: <strong className="text-white">ap-south-1</strong>
            <span className="hidden sm:inline"> (Sri Lanka)</span>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-900/90 border border-indigo-500/25 text-indigo-300 shadow-sm shadow-indigo-500/10">
          <Server className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
          <span>
            Docker: <strong className="text-emerald-400">Active</strong>
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-slate-900/90 border border-emerald-500/25 text-emerald-300 shadow-sm shadow-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <span>
            Latency: <strong className="text-white">12ms</strong>
          </span>
        </div>
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-white/10 text-slate-400">
          <Network className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
          <span>Distributed Mesh Topology</span>
        </div>
      </div>

      {/* Main Catchy Title with Shimmer */}
      <h1 className="w-full text-xl xs:text-2xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-tight sm:leading-[1.15]">
        Engineering Reliable <br />
        <span className="shimmer-text">Cloud &amp; Software Systems</span>
      </h1>

      {/* Bio / Tagline */}
      <div className="mt-7 sm:mt-9 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-4">
        <p
          className="text-base sm:text-xl md:text-2xl text-slate-100 font-semibold tracking-normal sm:tracking-wide leading-snug sm:leading-relaxed"
          style={{ wordSpacing: '0.18em' }}
        >
          I'm <strong className="text-white font-bold">{profileData.name}</strong>, a Cloud Computing undergraduate at{' '}
          <span className="text-cyan-300 font-semibold whitespace-nowrap">{profileData.university}</span>.
        </p>

        <p
          className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl leading-relaxed font-normal"
          style={{ wordSpacing: '0.10em' }}
        >
          {profileData.headline}. Bridging scalable cloud architectures, enterprise networking, and full-stack systems engineering with robust reliability and DevOps automation.
        </p>
      </div>

      {/* Quick Location & Credential Tags */}
      <div className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono text-slate-400 w-full max-w-xs sm:max-w-3xl mx-auto">
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>{profileData.location.split(',')[0]}, Sri Lanka</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-white/5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>{profileData.degree.replace('in ', '')}</span>
        </div>
        <a
          href={profileData.socialLinks.capstone}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition-all"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span>luxora.bond</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Action Buttons */}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full max-w-xl mx-auto">
        <a
          href="#projects"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5 transition-all"
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Explore Projects</span>
        </a>

        <a
          href="#contact"
          className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap text-white bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-cyan-400/50 shadow-md hover:shadow-slate-800/50 transform hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 text-cyan-400" />
          <span>Get In Touch</span>
        </a>
      </div>

      {/* Social & Direct Contact Icons */}
      <div className="mt-12 flex items-center justify-center gap-4 sm:gap-5 text-slate-300">
        {/* GitHub */}
        <a
          href={profileData.socialLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/60 hover:text-white hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group"
          title="GitHub — devpanda4real"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={profileData.socialLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-[#0A66C2]/70 hover:text-[#0A66C2] hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group"
          title="LinkedIn — Imesh Kaushalya"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74v-8.37H5.06v8.37h2.8z" />
          </svg>
        </a>

        {/* Email */}
        <a
          href={`mailto:${profileData.socialLinks.email}`}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group"
          title={`Send Email — ${profileData.socialLinks.email}`}
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </a>

        {/* WhatsApp (Controlled by EcosystemVisibility) */}
        <a
          href={`mailto:${profileData.socialLinks.email}?subject=WhatsApp%20Inquiry`}
          data-visibility="whatsapp-link"
          style={{ display: 'none' }}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-[#25D366]/70 hover:text-[#25D366] hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group"
          title="WhatsApp — (Available upon verified request)"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.32" />
          </svg>
        </a>

        {/* Phone Call (Controlled by EcosystemVisibility) */}
        <a
          href={`mailto:${profileData.socialLinks.email}?subject=Phone%20Number%20Inquiry`}
          data-visibility="phone-link"
          data-original-href={`mailto:${profileData.socialLinks.email}?subject=Phone%20Number%20Inquiry`}
          style={{ pointerEvents: 'none', opacity: 0.7 }}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group"
          title="Direct phone inquiry available upon verified recruiter request"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>

        {/* Copy Email Button */}
        <button
          onClick={onCopyEmail}
          className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-400/60 hover:text-cyan-400 hover:bg-slate-800 hover:scale-110 transition-all shadow-lg flex items-center justify-center group cursor-pointer"
          title="Copy Email to Clipboard"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
