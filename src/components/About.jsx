import React from 'react';
import { User, GraduationCap, Sparkles, HeartHandshake } from 'lucide-react';
import { profileData } from '../data/profile.js';

export default function About() {
  return (
    <section id="about" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-white/5 reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            <User className="w-4 h-4" /> 01 &mdash; About Me
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            Academic Foundation &amp; Career Aspirations
          </h2>
        </div>
        <p className="text-slate-400 text-sm max-w-md">
          A dedicated Cloud Computing undergraduate with solid foundations in networking, containerization, and modern software architecture.
        </p>
      </div>

      {/* Clean 2-Card Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic & Technical Journey (7 cols) */}
        <div className="lg:col-span-7 glass-card p-7 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                  Education &amp; Background
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {profileData.degree}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                I am an undergraduate student currently enrolled in the <strong>{profileData.degree}</strong> program at{' '}
                <strong>{profileData.university}</strong> (Class of {profileData.graduationYear}), maintaining an academic standing of{' '}
                <strong>CGPA 3.53 / 4.00</strong>.
              </p>
              <p>
                My core studies and hands-on explorations center around <strong>cloud infrastructure</strong>, <strong>containerization with Docker</strong>, <strong>Linux server administration</strong>, and <strong>enterprise networking</strong> (TCP/IP subnetting, DNS, routing protocols, and firewall rules).
              </p>
              <p>
                Beyond infrastructure, I bridge the gap between business specifications and technical execution—authoring structured documentation (BRD, functional requirements, and process models) while architecting scalable full-stack applications.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-300 font-semibold">
                {profileData.statusBadge}
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {profileData.location}
            </span>
          </div>
        </div>

        {/* Right Column: Quick Profile Highlights & Core Pillars (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="glass-card p-6 rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Profile Snapshot
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">University</span>
                <span className="text-white font-semibold text-xs">{profileData.university}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Academic CGPA</span>
                <span className="text-cyan-400 font-bold font-mono text-sm">3.53 / 4.00</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Target Period</span>
                <span className="text-white font-semibold text-xs">2027 IT Internship</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Working Modality</span>
                <span className="text-emerald-400 font-semibold text-xs">{profileData.workPreference}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-mono text-slate-400 block mb-2">Core Focus Areas</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono">
                  Cloud Infrastructure
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[11px] font-mono">
                  Docker Containers
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono">
                  Enterprise Networking
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-mono">
                  Linux Systems
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono">
                  Requirements Analysis (BA)
                </span>
              </div>
            </div>
          </div>

          {/* University Engagement & Values */}
          <div className="glass-card p-5 rounded-3xl border border-purple-500/20 bg-purple-500/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Community &amp; Student Leadership</span>
              <p className="text-slate-300 text-xs mt-0.5">
                Active volunteer with SLTC Student Interactive Society (SIS), organizing campus cultural events, environmental cleanups, and flood relief initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
