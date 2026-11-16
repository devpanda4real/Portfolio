import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Languages,
  ShieldCheck,
  Mail,
  ExternalLink
} from 'lucide-react';
import { educationData } from '../data/education.js';
import { experienceData } from '../data/experience.js';

export default function Experience() {
  const { degreeProgress, schoolEducation, languages } = educationData;
  const { roles, referees } = experienceData;

  return (
    <section id="experience" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-white/5 reveal">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          <Briefcase className="w-4 h-4" /> 04 &mdash; Experience &amp; Education
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
          Academic Foundation &amp; Practical Leadership
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Degree progression at SLTC Research University alongside hands-on engineering labs and student community service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* COLUMN 1: EDUCATION */}
        <div id="education">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-4">
            <GraduationCap className="w-4 h-4" /> Academic Progression
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-8">Academic Background</h2>

          <div className="space-y-6 relative border-l-2 border-slate-800 pl-6 ml-3">
            {/* Degree */}
            <div className="relative group">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-cyan-500 border-4 border-dark-950 group-hover:scale-125 transition-transform shadow-lg shadow-cyan-500/50" />

              <div className="spotlight-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-cyan-400">{degreeProgress.period}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[11px] font-mono border border-cyan-500/20">
                    {degreeProgress.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{degreeProgress.degree}</h3>
                <p className="text-sm font-medium text-slate-300">{degreeProgress.institution}</p>

                {/* Academic Results & Progress Telemetry */}
                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-cyan-300 font-bold">CGPA: {degreeProgress.cgpa}</span>
                    <span className="text-slate-400 text-[11px]">({degreeProgress.division})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">
                      {degreeProgress.creditsCompleted} / {degreeProgress.totalCredits} Credits ({degreeProgress.progressPercentage})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">{degreeProgress.focus}</p>
              </div>
            </div>

            {/* School Education */}
            {schoolEducation.map((edu, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-700 border-4 border-dark-950 group-hover:scale-125 transition-transform" />

                <div className="spotlight-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400">{edu.year}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                      {edu.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{edu.level}</h3>
                  <p className="text-xs font-medium text-slate-400">{edu.school}</p>
                  {edu.stream && <p className="text-xs text-slate-500 mt-1">{edu.stream}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Languages Box */}
          <div className="mt-8 spotlight-card p-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-3">
              <Languages className="w-4 h-4" /> Languages
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {languages.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5">
                  <div className="text-sm font-bold text-white">{lang.name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono mt-0.5">{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional References Box */}
          <div className="mt-6 spotlight-card p-6 border-indigo-500/20">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase mb-3">
              <ShieldCheck className="w-4 h-4" /> References
            </div>
            <div className="space-y-3">
              {referees.map((ref, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ref.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{ref.badge}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{ref.department}</span>

                  {ref.email && (
                    <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>
                        Available upon formal academic request (
                        <a href={`mailto:${ref.email}`} className="text-cyan-300 hover:underline">
                          {ref.email}
                        </a>
                        )
                      </span>
                    </span>
                  )}

                  {ref.linkedIn && (
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
                      <span className="text-[11px] text-slate-400">
                        Tel:{' '}
                        <span data-visibility="referee-phone">
                          <a
                            href="mailto:ikaushalya101official@gmail.com?subject=Academic%20Referee%20Contact%20Request"
                            className="text-cyan-300 hover:underline"
                          >
                            Available upon formal academic request
                          </a>
                        </span>
                      </span>
                      <a
                        href={ref.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: EXPERIENCE & LEADERSHIP */}
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase mb-4">
            <Briefcase className="w-4 h-4" /> Practical Experience &amp; Leadership
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
            Experience &amp; Leadership
          </h2>

          <div className="space-y-6 relative border-l-2 border-slate-800 pl-6 ml-3">
            {roles.map((role, idx) => (
              <div key={idx} className="relative group">
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full ${
                    idx === 0
                      ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50'
                      : 'bg-slate-700'
                  } border-4 border-dark-950 group-hover:scale-125 transition-transform`}
                />

                <div className="spotlight-card p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-indigo-400">{role.domain}</span>
                    <span className="text-xs font-mono text-slate-400">{role.period}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{role.title}</h3>
                  <p className="text-xs font-medium text-slate-400">{role.subtitle}</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
