import React from 'react';
import { Cpu, Cloud, Server, Code2, Database, Wrench, Sparkles } from 'lucide-react';
import { skillsData } from '../data/skills.js';

const iconMap = {
  cloud: Cloud,
  server: Server,
  'code-2': Code2,
  database: Database,
  wrench: Wrench,
  sparkles: Sparkles
};

const colorConfig = {
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
    tagText: 'text-cyan-400/80'
  },
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    dot: 'bg-indigo-400',
    tagText: 'text-indigo-400/80'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    tagText: 'text-emerald-400/80'
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    tagText: 'text-amber-400/80'
  },
  rose: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    tagText: 'text-rose-400/80'
  }
};

export default function Skills() {
  return (
    <section id="skills" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-white/5 reveal">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          <Cpu className="w-4 h-4" /> 02 &mdash; Technical Skills
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
          Core Technical &amp; Professional Competencies
        </h2>
        <p className="text-slate-400 text-sm mt-3">
          Grouped into cloud &amp; infrastructure, backend &amp; security, languages, frameworks, and engineering tools &mdash; including only what I can explain, demonstrate, and apply.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillsData.map((category, idx) => {
          const colors = colorConfig[category.color] || colorConfig.cyan;
          const IconComponent = iconMap[category.icon] || Cpu;

          return (
            <div key={idx} className="spotlight-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base">{category.category}</h3>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  {category.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0 mt-1.5`} />
                      <div>
                        <strong className="text-white font-medium">{skill.name}</strong>
                        {skill.subtext && (
                          <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                            {skill.subtext}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`mt-6 pt-4 border-t border-white/5 text-[11px] font-mono ${colors.tagText}`}>
                SLTC &bull; Competency Verified
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
