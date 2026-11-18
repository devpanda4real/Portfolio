import React, { useState, useEffect } from 'react';
import {
  Layers,
  Info,
  Crown,
  Lock,
  ExternalLink,
  Sparkles,
  FileText,
  CheckSquare,
  Cpu,
  Bot,
  FileSpreadsheet,
  GitBranch,
  CheckCircle,
  Compass,
  Code2,
  Layout,
  Star,
  Globe
} from 'lucide-react';
import { projectsData } from '../data/projects.js';
import { fetchPublicRepos } from '../services/github.js';
import { GITHUB_CONFIG } from '../config/github.config.js';

export default function Projects({ onOpenLuxoraModal }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [githubTelemetry, setGithubTelemetry] = useState({});

  useEffect(() => {
    // Optionally fetch live telemetry (stars, latest pushed dates) for projects linked to GitHub
    async function loadTelemetry() {
      try {
        const repos = await fetchPublicRepos(GITHUB_CONFIG.username, false);
        const map = {};
        for (const repo of repos) {
          map[repo.name.toLowerCase()] = repo;
        }
        setGithubTelemetry(map);
      } catch {
        // Silently fallback to static data if offline
      }
    }
    loadTelemetry();
  }, []);

  // Filter curated projects based on active tab
  const filteredProjects = projectsData.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'cloud-web') return p.category === 'cloud-web';
    if (activeFilter === 'algorithms') return p.category === 'algorithms';
    if (activeFilter === 'concept') return p.category === 'concept';
    return true;
  });

  const flagship = projectsData.find((p) => p.id === 'luxora');
  const secondaryProjects = filteredProjects.filter((p) => p.id !== 'luxora');
  const showFlagship = (activeFilter === 'all' || activeFilter === 'cloud-web') && flagship;

  // Filter counts
  const countAll = projectsData.length;
  const countCloudWeb = projectsData.filter((p) => p.category === 'cloud-web').length;
  const countAlgorithms = projectsData.filter((p) => p.category === 'algorithms').length;
  const countConcept = projectsData.filter((p) => p.category === 'concept').length;

  return (
    <section id="projects" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-white/5 reveal">
      {/* 03 — Projects Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
            <Layers className="w-4 h-4" /> 03 &mdash; Projects
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
            Featured Projects &amp; Implementations
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Showcasing architectural capstones, full-stack cloud systems, and algorithmic engines with role contributions, system specifications, and live platforms.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'text-white bg-cyan-600/30 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({countAll})
          </button>
          <button
            onClick={() => setActiveFilter('cloud-web')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'cloud-web'
                ? 'text-white bg-cyan-600/30 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cloud &amp; Web ({countCloudWeb})
          </button>
          <button
            onClick={() => setActiveFilter('algorithms')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'algorithms'
                ? 'text-white bg-cyan-600/30 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Algorithms ({countAlgorithms})
          </button>
          <button
            onClick={() => setActiveFilter('concept')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeFilter === 'concept'
                ? 'text-white bg-cyan-600/30 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Concepts &amp; Mobile ({countConcept})
          </button>
        </div>
      </div>

      {/* Transparent Status Legend Bar */}
      <div className="mb-10 p-4 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400 font-sans">Transparent Status System:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Completed
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> In Production
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20 font-semibold">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> Planned
          </span>
        </div>
      </div>

      {/* FLAGSHIP CAPSTONE PROJECT: LUXORA */}
      {showFlagship && (
        <div className="mb-12">
          <div className="project-card spotlight-card border-cyan-500/40 shadow-2xl relative overflow-hidden">
            {/* Flagship Browser Frame Header */}
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  {flagship.badge}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={flagship.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>{flagship.liveUrl}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-xs font-mono border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{flagship.status}</span>
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Project Title & Roles */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    {flagship.subtitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2.5">
                    {flagship.title}
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                      Role: {flagship.role}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Team: {flagship.team}</span>
                  </div>
                </div>

                {/* Deliverables Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-center shrink-0">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20">
                    <span className="text-xl font-bold text-cyan-400">{flagship.metrics.frCount}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Functional Req (FRs)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20">
                    <span className="text-xl font-bold text-indigo-400">{flagship.metrics.nfrCount}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Non-Functional Req</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/20">
                    <span className="text-xl font-bold text-amber-400">{flagship.metrics.brCount}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Business Rules (BR)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                    <span className="text-xl font-bold text-emerald-400">{flagship.metrics.docType}</span>
                    <span className="block text-xs text-slate-400 mt-0.5">Formal System Spec</span>
                  </div>
                </div>
              </div>

              {/* Project Overview Callout */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 mb-6">
                <div className="text-xs font-mono font-semibold uppercase text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Project Overview
                </div>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">{flagship.summary}</p>
              </div>

              {/* SECTION A: Completed Work */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Completed
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    My Contributions &mdash; Completed Work
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300 leading-relaxed">
                  {flagship.completedContributions.map((c, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-start gap-2.5 ${
                        i === flagship.completedContributions.length - 1 ? 'md:col-span-2' : ''
                      }`}
                    >
                      <div className="p-1 rounded bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-white">{c.title}:</strong> {c.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION B: Planned Improvements */}
              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 mb-6">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Planned
                  </span>
                  <span className="text-xs font-bold text-sky-200 uppercase tracking-wider font-mono">
                    Planned Improvements
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                  {flagship.plannedImprovements.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Bot className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-white">{p.title}:</strong> {p.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Stack & Actions */}
              <div className="pt-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-slate-400 block mb-1.5">Technology Stack:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {flagship.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md bg-slate-950 border border-white/10 text-xs font-mono text-cyan-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenLuxoraModal}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-cyan-400/50 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                    <span>View BRD, FRs/NFRs &amp; Team Roles</span>
                  </button>
                  <a
                    href={flagship.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                  >
                    <span>Launch Live Platform</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEATURED PROJECTS GRID (Portfolio, Smart City, Detail Me) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {secondaryProjects.map((project) => {
          // Check if GitHub telemetry exists for this project
          const repoKey = project.id === 'portfolio' ? 'portfolio' : project.id === 'smart-city' ? 'java' : null;
          const liveRepo = repoKey && githubTelemetry[repoKey] ? githubTelemetry[repoKey] : null;

          return (
            <div key={project.id} className="project-card spotlight-card flex flex-col justify-between">
              <div>
                {/* Window Mockup Header */}
                <div className="px-4 py-3 bg-slate-950 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-white/5 text-xs font-mono text-indigo-300 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-indigo-400" />
                    <span>{project.fileName}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {project.status}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-mono border border-indigo-500/20">
                      <GitBranch className="w-3 h-3" /> {project.role}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{project.projectType}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between gap-2">
                    <span>{project.title}</span>
                    {liveRepo && liveRepo.stars > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {liveRepo.stars}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2.5 mb-4 leading-relaxed">{project.summary}</p>

                  {/* Completed Work */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed Work:
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
                      {project.completedContributions?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>
                            <strong>{item.title}:</strong> {item.desc}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Planned Improvements */}
                  {project.plannedImprovements && project.plannedImprovements.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/20 mb-4">
                      <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                        <Compass className="w-3.5 h-3.5" /> Planned Improvements:
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {project.plannedImprovements.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-sky-400 font-bold">&bull;</span>
                            <span>
                              <strong>{item.title}:</strong> {item.desc}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tech Badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-900 border border-white/5 text-xs font-mono text-indigo-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="px-6 py-3.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:underline"
                    >
                      <Code2 className="w-3.5 h-3.5" /> View Repository
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" /> Live Platform
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {!project.githubUrl && !project.liveUrl && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                      <Layout className="w-3.5 h-3.5 text-sky-400" /> Systems Architecture
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-mono">{project.projectType}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
