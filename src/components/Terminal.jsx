import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import {
  terminalCommonCommands,
  neofetchWindows,
  neofetchMac,
  migrationRadarItems
} from '../data/terminalData.js';

export default function Terminal({ onAdminLogin }) {
  const [terminalOS, setTerminalOS] = useState('windows'); // 'windows' | 'mac'
  const [history, setHistory] = useState([]);
  const [commandInput, setCommandInput] = useState('');
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [pastCommands, setPastCommands] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const terminalBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (history.length > 0 && terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;

    setPastCommands((prev) => [...prev, cmd]);
    setCmdIndex(-1);

    const normalized = cmd.toLowerCase().replace(/^[.\\/]+/, '').replace(/^powershell\s+/, '');

    if (['cls', 'clear', 'clear-host'].includes(normalized)) {
      setHistory([]);
      return;
    }

    if (['mode mac', 'set-os mac', 'os mac', 'mac', 'macos', 'apple'].includes(normalized)) {
      setTerminalOS('mac');
      setHistory((prev) => [
        ...prev,
        { cmd, output: '[+] Switched Terminal Environment to macOS / iOS (zsh 5.9). Apple Silicon node active.' }
      ]);
      return;
    }

    if (['mode win', 'mode windows', 'set-os win', 'set-os windows', 'os win', 'os windows', 'win', 'windows', 'powershell', 'ps'].includes(normalized)) {
      setTerminalOS('windows');
      setHistory((prev) => [
        ...prev,
        { cmd, output: '[+] Switched Terminal Environment to Windows Terminal (PowerShell 7.4). Windows 11 node active.' }
      ]);
      return;
    }

    if (normalized === 'neofetch') {
      setHistory((prev) => [
        ...prev,
        { cmd, output: terminalOS === 'mac' ? neofetchMac : neofetchWindows }
      ]);
      return;
    }

    if (normalized.startsWith('migration-news')) {
      const parts = normalized.split(/\s+/);
      const param = parts[1];
      if (param && migrationRadarItems[param]) {
        const item = migrationRadarItems[param];
        const out = `[${param}] ${item.title}\n========================================================================\nCategory:        ${item.category}\nStrategy:        ${item.strategy}\nDowntime Target: ${item.downtime}\nTakeaway:        ${item.takeaway}\nDocumentation:   ${item.url}\n\nExecution / CLI Snippet:\n${item.snippet}\n========================================================================\n[i] Enter 'migration-news' to view the complete radar summary table.`;
        setHistory((prev) => [...prev, { cmd, output: out }]);
      } else {
        const out = `IMESH KAUSHALYA — CLOUD & SYSTEMS MIGRATION NEWS RADAR (2026)
========================================================================================
ID  TOPIC                               CATEGORY             CORE MIGRATION STRATEGY
----------------------------------------------------------------------------------------
[1] AWS 7 Rs Enterprise Cloud Cutover    Cloud Migration      AWS MGN + DMS Continuous Replication (CDC)
[2] Zero-Downtime PostgreSQL to Aurora  Database & Systems   Logical replication slots + weighted cutover
[3] VM Monolith to Amazon EKS Modernize DevOps & K8s         Lightweight OCI containers + ArgoCD GitOps
[4] Live Linux Kernel Patching (Kpatch) Database & Systems   Zero-reboot memory ftrace kernel CVE patches
[5] Strangler Fig Microservice Cutover  Cloud Architecture   API Gateway path routing & incremental cutover
[6] Serverless AI Cutover (Gemini APIs) Modern AI & Cloud    Dedicated GPU VM offload to JSON Schema APIs
========================================================================================
[i] Enter 'migration-news <1-6>' (e.g. 'migration-news 1') to inspect architecture snippet & cutover steps.
[+] Enterprise Cloud Migration Radar by Imesh Kaushalya.`;
        setHistory((prev) => [...prev, { cmd, output: out }]);
      }
      return;
    }

    if (normalized.startsWith('admin')) {
      if (onAdminLogin) onAdminLogin();
      setHistory((prev) => [
        ...prev,
        { cmd, output: '[+] Super Admin Visibility Controls invoked. Opening access panel.' }
      ]);
      return;
    }

    if (normalized === 'whoami') {
      const isSuper = Boolean(window.EcosystemVisibility && window.EcosystemVisibility.isSuperAdmin);
      const out = isSuper
        ? `super admin (Imesh Kaushalya)\nFull administrative privileges active.\nAccess: Full Super Admin Privacy Matrix\nType 'logout' to return to Visitor mode.`
        : `visitor\nCandidate: Imesh Kaushalya — BSc (Hons) Cloud Computing @ SLTC\nStatus:    Seeking General IT / Cloud Internship (2027)\nLocation:  Horana, Sri Lanka\nType 'admin' to open Super Admin mode.`;
      setHistory((prev) => [...prev, { cmd, output: out }]);
      return;
    }

    if (normalized === 'contact') {
      const out = `Official Communication Channels:
Email:    ikaushalya101official@gmail.com
LinkedIn: https://www.linkedin.com/in/imesh-kaushalya-0a080a2b6/
GitHub:   https://github.com/devpanda4real
Location: Horana, Western Province, Sri Lanka
Status:   Available for On-site / Hybrid / Remote (2027)`;
      setHistory((prev) => [...prev, { cmd, output: out }]);
      return;
    }

    if (terminalCommonCommands[normalized]) {
      setHistory((prev) => [...prev, { cmd, output: terminalCommonCommands[normalized] }]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        cmd,
        output: `${cmd} : The term '${cmd}' is not recognized as the name of a cmdlet or program. Type 'help' to view available commands.`
      }
    ]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(commandInput);
      setCommandInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (pastCommands.length > 0) {
        const nextIdx = cmdIndex === -1 ? pastCommands.length - 1 : Math.max(0, cmdIndex - 1);
        setCmdIndex(nextIdx);
        setCommandInput(pastCommands[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdIndex !== -1) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < pastCommands.length) {
          setCmdIndex(nextIdx);
          setCommandInput(pastCommands[nextIdx]);
        } else {
          setCmdIndex(-1);
          setCommandInput('');
        }
      }
    }
  };

  const promptPrefix =
    terminalOS === 'mac' ? 'imesh@cloud-mac ~ % ' : 'PS C:\\Users\\ImeshKaushalya> ';

  return (
    <section
      id="interactive-hub"
      className="relative max-w-4xl mx-auto px-6 py-20 border-t border-white/5 reveal transition-all duration-300"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          <TerminalIcon className="w-4 h-4" /> 05 &mdash; Interactive Terminal
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
          Explore via Cloud Command Line
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Recruiters and engineers can test interactive PowerShell 7 / Unix commands directly in this simulated cloud node.
        </p>
      </div>

      {/* Shell Meta Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          <TerminalIcon className="w-4 h-4 text-sky-400" />
          <span>
            {terminalOS === 'mac' ? 'macOS Terminal (zsh 5.9)' : 'Windows Terminal (PowerShell 7.4)'}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            {terminalOS === 'mac'
              ? 'cloud-mac.local • Apple Silicon • ARM64'
              : 'SLTC-CLOUD-NODE-01 • Windows 11 • x64'}
          </span>
        </div>
      </div>

      {/* Terminal Window Frame */}
      <div
        id="windows-terminal-window"
        className={`terminal-dark ${
          terminalOS === 'mac' ? 'terminal-os-mac' : 'terminal-os-windows'
        } rounded-xl border border-white/10 overflow-hidden backdrop-blur-xl transition-all duration-300 shadow-2xl`}
      >
        {/* Titlebar */}
        <div className="win-titlebar px-2.5 sm:px-3 pt-2 pb-1.5 border-b border-white/10 flex items-center justify-between select-none min-h-[42px] bg-slate-900/90">
          <div className="flex items-center gap-2 sm:gap-3">
            {terminalOS === 'mac' ? (
              <div className="flex items-center gap-2 py-1">
                <button
                  onClick={() => setHistory([])}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] cursor-pointer"
                  title="Clear Session"
                />
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] cursor-pointer"
                  title="Minimize Window"
                />
                <button
                  className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] cursor-pointer"
                  title="Zoom"
                />
                <span className="ml-1.5 text-xs font-mono text-slate-300">imesh — zsh — 80×24</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-t-md bg-slate-800/80 border-t-2 border-cyan-400 text-xs font-mono text-white">
                  <span className="font-semibold tracking-tight">PowerShell 7.4</span>
                  <span className="text-[10px] text-cyan-400 ml-0.5">[Admin]</span>
                  <span
                    onClick={() => setHistory([])}
                    className="ml-1 opacity-60 hover:opacity-100 cursor-pointer text-xs"
                    title="Reset Session"
                  >
                    &times;
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* OS Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs font-mono">
            <button
              onClick={() => setTerminalOS('windows')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                terminalOS === 'windows'
                  ? 'text-sky-400 bg-sky-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Windows
            </button>
            <button
              onClick={() => setTerminalOS('mac')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
                terminalOS === 'mac'
                  ? 'text-sky-400 bg-sky-500/20 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              macOS
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        {!isMinimized && (
          <div
            ref={terminalBodyRef}
            onClick={() => inputRef.current?.focus()}
            className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed max-h-[420px] overflow-y-auto bg-dark-950/90 text-slate-200"
          >
            {/* Intro Welcome Banner */}
            <div className="mb-4 text-slate-400 opacity-90">
              {terminalOS === 'mac' ? (
                <div>
                  Last login: {new Date().toDateString()} on ttys001<br />
                  Darwin cloud-mac.local 23.4.0 (arm64)<br />
                  Type <span className="text-cyan-400 font-bold">'help'</span> to inspect available cloud commands.
                </div>
              ) : (
                <div>
                  Windows PowerShell 7.4.2<br />
                  Copyright (C) Microsoft Corporation. All rights reserved.<br />
                  Type <span className="text-cyan-400 font-bold">'help'</span> to inspect available cloud commands.
                </div>
              )}
            </div>

            {/* Past Command Output */}
            {history.map((item, idx) => (
              <div key={idx} className="mb-3">
                <div className="text-cyan-400 font-semibold flex items-center gap-1">
                  <span>{promptPrefix}</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
                <pre className="text-slate-300 mt-1 whitespace-pre-wrap font-mono leading-normal opacity-95">
                  {item.output}
                </pre>
              </div>
            ))}

            {/* Live Input Line */}
            <div className="flex items-center gap-1 text-cyan-400 font-semibold">
              <span>{promptPrefix}</span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent outline-none text-white font-mono text-xs sm:text-[13px]"
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-slate-950/80 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
          <span className="text-slate-500 mr-1">Quick:</span>
          {['whoami', 'about', 'skills', 'projects', 'education', 'migration-news', 'neofetch', 'clear'].map(
            (cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
