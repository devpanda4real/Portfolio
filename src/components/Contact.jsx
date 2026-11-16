import React, { useState } from 'react';
import { Mail, PhoneCall, Copy, ExternalLink, MapPin, Send } from 'lucide-react';
import { profileData } from '../data/profile.js';

export default function Contact({ onCopyEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Connecting / Project & Tech Inquiry',
    message: ''
  });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:${profileData.socialLinks.email}?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `From: ${formData.name} (${formData.email})\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailto;
    setFeedback('Email client opened. Thank you for reaching out!');
    setTimeout(() => setFeedback(''), 5000);
  };

  return (
    <section id="contact" className="relative max-w-7xl mx-auto px-6 py-20 border-t border-white/5 reveal">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
          <Mail className="w-4 h-4" /> 06 &mdash; Contact
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-2">
          Get in Touch &bull; Connect with Imesh
        </h2>
        <p className="text-slate-400 text-sm mt-3">
          I welcome technical discussions, academic collaborations, and industry networking. Reach out directly or send a message below!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Email Card */}
          <div className="spotlight-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs text-slate-400 block font-mono">Email Address</span>
                <a
                  href={`mailto:${profileData.socialLinks.email}`}
                  className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors truncate block"
                >
                  {profileData.socialLinks.email}
                </a>
              </div>
            </div>
            <button
              onClick={onCopyEmail}
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Copy Email"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile / WhatsApp Card */}
          <div className="spotlight-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-mono">Mobile / WhatsApp</span>
                <a
                  href={`mailto:${profileData.socialLinks.email}?subject=Phone%20Number%20Inquiry`}
                  data-visibility="phone-link"
                  data-original-href={`mailto:${profileData.socialLinks.email}?subject=Phone%20Number%20Inquiry`}
                  className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors block"
                >
                  <span
                    data-visibility="phone-text"
                    data-original-phone="Available upon verified recruiter request"
                  >
                    +94 76 ••• •••• (Protected)
                  </span>
                </a>
              </div>
            </div>
            <a
              href={`mailto:${profileData.socialLinks.email}?subject=WhatsApp%20Inquiry`}
              data-visibility="whatsapp-link"
              className="p-2 text-slate-400 hover:text-[#25D366] hover:bg-slate-800 rounded-lg transition-colors"
              title="Chat on WhatsApp (Available upon request)"
            >
              <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.12-.22-.19-.47-.32" />
              </svg>
            </a>
          </div>

          {/* LinkedIn Card */}
          <div className="spotlight-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-[#0A66C2] flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-mono">LinkedIn Profile</span>
                <a
                  href={profileData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors block truncate max-w-[210px] sm:max-w-none"
                >
                  linkedin.com/in/imesh-kaushalya
                </a>
              </div>
            </div>
            <a
              href={profileData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Open LinkedIn"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* GitHub Card */}
          <div className="spotlight-card p-5 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 border border-white/5">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-mono">GitHub Profile</span>
                <a
                  href={profileData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-white hover:text-cyan-400 transition-colors block truncate max-w-[210px] sm:max-w-none"
                >
                  github.com/devpanda4real
                </a>
              </div>
            </div>
            <a
              href={profileData.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
              title="Open GitHub"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Location Card */}
          <div className="spotlight-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-mono">Location</span>
              <span className="text-sm font-semibold text-white">{profileData.location}</span>
            </div>
          </div>
        </div>

        {/* Direct Email Dispatch Form */}
        <div className="lg:col-span-7 spotlight-card p-8 relative">
          <h3 className="text-2xl font-bold text-white mb-2">Send an Instant Message</h3>
          <p className="text-xs text-slate-400 mb-6">
            Fill in the details below to dispatch an inquiry to{' '}
            <span className="text-cyan-400 font-mono">{profileData.socialLinks.email}</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Your Name / Organization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engineering Lead / Recruiter"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                  Your Contact Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 font-mono">
                Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Hello Imesh, I reviewed your portfolio and would like to connect..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 focus:border-cyan-400 focus:outline-none text-white text-sm placeholder:text-slate-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>

          {feedback && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center font-mono">
              {feedback}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
