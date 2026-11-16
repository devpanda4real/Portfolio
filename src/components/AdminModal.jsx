import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Lock, Globe, KeyRound, LogOut } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onToast }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState({
    showPhoneNumber: false,
    showWhatsApp: false,
    showRefereePhone: false
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (window.EcosystemVisibility) {
      setIsAuthenticated(Boolean(window.EcosystemVisibility.isSuperAdmin));
      setSettings(window.EcosystemVisibility.getSettings() || {});
    }

    const handleLoaded = (e) => {
      if (e.detail) {
        setSettings(e.detail);
        setIsAuthenticated(Boolean(window.EcosystemVisibility?.isSuperAdmin));
      }
    };
    const handleChanged = (e) => {
      if (e.detail?.settings) {
        setSettings(e.detail.settings);
        setIsAuthenticated(Boolean(e.detail.isSuperAdmin));
      }
    };

    window.addEventListener('ecosystemVisibilityLoaded', handleLoaded);
    window.addEventListener('ecosystemVisibilityChanged', handleChanged);

    return () => {
      window.removeEventListener('ecosystemVisibilityLoaded', handleLoaded);
      window.removeEventListener('ecosystemVisibilityChanged', handleChanged);
    };
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!window.EcosystemVisibility) {
      setError('EcosystemVisibility module is not initialized.');
      return;
    }

    const success = await window.EcosystemVisibility.login(pin);
    if (success) {
      setIsAuthenticated(true);
      setSettings(window.EcosystemVisibility.getSettings());
      setPin('');
      if (onToast) onToast('Super Admin authenticated successfully.');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (window.EcosystemVisibility) {
      await window.EcosystemVisibility.logout();
      setIsAuthenticated(false);
      if (onToast) onToast('Logged out of Super Admin mode.');
    }
  };

  const handleToggle = async (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    if (window.EcosystemVisibility) {
      await window.EcosystemVisibility.updateSettings(updated);
      if (onToast) onToast(`Updated ${key} visibility to ${val ? 'Public' : 'Private'}`);
    }
  };

  const applyPreset = async (preset) => {
    const isPublic = preset === 'open';
    const updated = {
      showPhoneNumber: isPublic,
      showWhatsApp: isPublic,
      showRefereePhone: isPublic
    };
    setSettings(updated);
    if (window.EcosystemVisibility) {
      await window.EcosystemVisibility.updateSettings(updated);
      if (onToast) onToast(isPublic ? 'All personal details are now Public' : 'All personal details are now Masked / Private');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPin: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        if (onToast) onToast('Master password successfully updated.');
        setShowPasswordChange(false);
        setNewPassword('');
      } else {
        setError(data.error || 'Failed to update master password.');
      }
    } catch (err) {
      setError('Network error while updating password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-dark-950/80 backdrop-blur-md transition-all duration-300">
      <div className="relative w-full max-w-md bg-slate-900/95 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Super Admin Visibility Controls</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                  {isAuthenticated ? 'Active' : 'Protected'}
                </span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Control what recruiters &amp; public visitors can see
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

        {/* Modal Body */}
        <div className="p-6">
          {!isAuthenticated ? (
            /* Login Gate */
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-2xl bg-slate-950/80 border border-white/10 mb-4 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
                  IK
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Imesh Kaushalya</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-semibold">
                      Super Admin
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Account Status: Locked (Public Mode)
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">Super Admin Account Login</h4>
              <p className="text-xs text-slate-400 mb-5 max-w-sm mx-auto">
                Enter your master password to access the Admin Privacy Board and arrange public vs private visibility for your personal contact details.
              </p>

              <form onSubmit={handleLogin} className="max-w-xs mx-auto flex gap-2">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter master password..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-amber-400 focus:outline-none placeholder-slate-600 shadow-inner"
                  required
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Sign In
                </button>
              </form>
              {error && <div className="text-xs text-rose-400 font-mono mt-3">{error}</div>}
            </div>
          ) : (
            /* Admin Board */
            <div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-dark-950 border border-white/5 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-bold">Imesh Kaushalya</span>
                  <span className="text-emerald-300 text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono">
                    Live Admin Board
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('stealth')}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[10px] font-semibold transition-colors cursor-pointer"
                    title="Mask all private info"
                  >
                    🛡️ All Private
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('open')}
                    className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30 transition-colors cursor-pointer"
                    title="Make visible for recruiters"
                  >
                    🌐 All Public
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 mb-4">
                {/* Phone */}
                <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Phone Number</span>
                  <div className="flex items-center gap-1 shrink-0 bg-slate-900 p-0.5 rounded-lg border border-white/10 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleToggle('showPhoneNumber', false)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        !settings.showPhoneNumber
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔒 Private
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle('showPhoneNumber', true)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        settings.showPhoneNumber
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌐 Public
                    </button>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">WhatsApp</span>
                  <div className="flex items-center gap-1 shrink-0 bg-slate-900 p-0.5 rounded-lg border border-white/10 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleToggle('showWhatsApp', false)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        !settings.showWhatsApp
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔒 Private
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle('showWhatsApp', true)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        settings.showWhatsApp
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌐 Public
                    </button>
                  </div>
                </div>

                {/* Referee */}
                <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Referee Contact</span>
                  <div className="flex items-center gap-1 shrink-0 bg-slate-900 p-0.5 rounded-lg border border-white/10 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleToggle('showRefereePhone', false)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        !settings.showRefereePhone
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🔒 Private
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle('showRefereePhone', true)}
                      className={`px-2.5 py-0.5 rounded-md transition-all font-semibold ${
                        settings.showRefereePhone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌐 Public
                    </button>
                  </div>
                </div>
              </div>

              {/* Password update & logout controls */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showPasswordChange ? 'Cancel' : 'Change Master Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-mono font-semibold border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>

              {showPasswordChange && (
                <form onSubmit={handleUpdatePassword} className="mt-3 p-3 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new master password..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white text-xs font-mono outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono transition-colors cursor-pointer"
                  >
                    Save New Password
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
