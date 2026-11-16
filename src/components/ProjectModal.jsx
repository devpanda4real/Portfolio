import React from 'react';
import { Sparkles, Users, FileCheck2, Bot, X, ExternalLink } from 'lucide-react';
import { projectsData } from '../data/projects.js';

export default function ProjectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const luxora = projectsData.find((p) => p.id === 'luxora') || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-950/80 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900/95 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Luxora &mdash; System Architecture &amp; Specification Deep Dive
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Live Platform:{' '}
                <a
                  href={luxora.liveUrl || 'https://luxora.bond/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline"
                >
                  luxora.bond
                </a>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Overview */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
            <span className="text-[11px] font-mono font-semibold uppercase text-cyan-400">
              Project Overview
            </span>
            <p className="text-slate-300 text-sm">
              <strong>Luxora</strong> is an ultra-premium, on-demand home concierge ecosystem tailored for high-end residential estates. It bridges discerning property owners with accredited service contractors through real-time matching, intelligent automated triage, and an innovative tokenized service economy.
            </p>
          </div>

          {/* Team Division of Responsibilities */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              1. Luxora Group 08 &mdash; Team Roles &amp; Responsibilities (CCS2313)
            </h4>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950/70">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Team Member</th>
                    <th className="py-2.5 px-3 font-semibold">Core Responsibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="bg-cyan-500/10 font-bold text-cyan-300">
                    <td className="py-2 px-3 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Imesh Kaushalya (You)
                    </td>
                    <td className="py-2 px-3">
                      Business Analysis (BA), Chatbot Development, Requirements (FR/NFR) &amp; Business Rules
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Deshan</td>
                    <td className="py-2 px-3 text-slate-400">Project Management &amp; Frontend Support</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Rashen</td>
                    <td className="py-2 px-3 text-slate-400">Backend Architecture &amp; Database Engineering</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Hasitha</td>
                    <td className="py-2 px-3 text-slate-400">Frontend Development &amp; Automated Testing</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-white">Dulsath</td>
                    <td className="py-2 px-3 text-slate-400">UI/UX Design Systems &amp; Quality Assurance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Documented Requirements Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              2. Documented Requirements &amp; Business Rules Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
                <span className="text-cyan-400 font-mono font-bold text-base block mb-0.5">71 FRs</span>
                <span className="text-xs text-white font-semibold block mb-1">Functional Requirements</span>
                <p className="text-[11px] text-slate-400">
                  Defined complete system operations across client subscriptions, custom concierge intake, contractor radius dispatch, and administrator moderation.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-indigo-500/20">
                <span className="text-indigo-400 font-mono font-bold text-base block mb-0.5">23 NFRs</span>
                <span className="text-xs text-white font-semibold block mb-1">Non-Functional Requirements</span>
                <p className="text-[11px] text-slate-400">
                  Structured system benchmarks including cryptographic security, uptime SLAs, low-latency API response times, and audit trail retention.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/20">
                <span className="text-amber-400 font-mono font-bold text-base block mb-0.5">25 Rules</span>
                <span className="text-xs text-white font-semibold block mb-1">Business Rules (BR-01&ndash;BR-25)</span>
                <p className="text-[11px] text-slate-400">
                  Formulated platform policies governing coin wallet refunds, zero-loss cancellation restoration, and dynamic pricing multipliers.
                </p>
              </div>
            </div>
          </div>

          {/* Planned Improvements: Chatbot Development & Gemini LLM */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                3. Planned Improvements &mdash; Chatbot Development &amp; Gemini LLM
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                Planned
              </span>
            </div>
            <p className="text-slate-400 mb-2 text-xs">
              Architected conversational concierge logic and roadmap for automated service triage:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 text-xs">
              <li>
                <strong>Chatbot Logic &amp; Dialogue Flow:</strong> Designed structured conversational branches and user intent mapping to guide subscribers through home service inquiries.
              </li>
              <li>
                <strong>Gemini LLM API Integration (Planned):</strong> Prepared implementation architecture to connect Google's Gemini API for dynamic, context-aware service recommendations and automated scheduling.
              </li>
            </ul>
          </div>

          {/* Footer action */}
          <div className="pt-2 flex justify-end">
            <a
              href="https://luxora.bond/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>Visit luxora.bond</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
