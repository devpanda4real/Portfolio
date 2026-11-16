/**
 * Ecosystem Visibility & Super Admin Privacy Control System
 * Imesh Kaushalya — Unified Personal Ecosystem
 * Controls public visibility of personal contact details and academic references.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'imesh_ecosystem_visibility_settings';

  // Safe defaults for public hosting (all sensitive personal data masked by default)
  const defaultSettings = {
    showPhoneNumber: false,
    showWhatsApp: false,
    showRefereePhone: false,
    recruiterInquiryOnly: true,
    lastUpdated: new Date().toISOString()
  };

  function getLocalSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {}
    return { ...defaultSettings };
  }

  function saveLocalSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  const EcosystemVisibility = {
    currentSettings: getLocalSettings(),
    isSuperAdmin: false,

    async init() {
      // Security: Admin state is never assumed from browser storage or URL parameters.
      // It must be verified strictly by the server API.
      this.isSuperAdmin = false;

      // Fetch live public visibility settings and server auth status
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.settings) {
            this.currentSettings = { ...defaultSettings, ...data.settings };
            saveLocalSettings(this.currentSettings);
          }
          if (data && data.isSuperAdmin === true) {
            this.isSuperAdmin = true;
          }
        }
      } catch (e) {
        // Fallback to safe defaults if server is unreachable
        this.currentSettings = getLocalSettings();
        this.isSuperAdmin = false;
      }

      // Apply to DOM
      this.applyVisibility();

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('ecosystemVisibilityLoaded', {
        detail: { settings: this.currentSettings, isSuperAdmin: this.isSuperAdmin }
      }));
    },

    getSettings() {
      return { ...this.currentSettings };
    },

    async login(pin) {
      const trimmed = (pin || '').trim();
      if (!trimmed) {
        return { success: false, error: 'Passcode cannot be empty.' };
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: trimmed })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            this.isSuperAdmin = true;
            this.applyVisibility();
            window.dispatchEvent(new CustomEvent('ecosystemVisibilityChanged', {
              detail: { settings: this.currentSettings, isSuperAdmin: true }
            }));
            return { success: true };
          }
        }
      } catch (e) {
        console.warn('[EcosystemVisibility] Authentication network request failed:', e.message);
      }

      this.isSuperAdmin = false;
      return { success: false, error: 'Invalid Super Admin credentials or authentication server unavailable.' };
    },

    async logout() {
      this.isSuperAdmin = false;
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {}

      this.applyVisibility();
      window.dispatchEvent(new CustomEvent('ecosystemVisibilityChanged', {
        detail: { settings: this.currentSettings, isSuperAdmin: false }
      }));
      return { success: true };
    },

    async updateSettings(newPartialSettings) {
      if (!this.isSuperAdmin) {
        console.warn('Super Admin privileges required to update visibility settings.');
        return this.currentSettings;
      }

      this.currentSettings = {
        ...this.currentSettings,
        ...newPartialSettings,
        lastUpdated: new Date().toISOString()
      };
      saveLocalSettings(this.currentSettings);

      // Save to server
      try {
        const res = await fetch('/api/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.currentSettings)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            this.currentSettings = { ...this.currentSettings, ...data.settings };
            saveLocalSettings(this.currentSettings);
          }
        }
      } catch (e) {
        console.warn('Saved visibility settings locally (offline/static mode).');
      }

      this.applyVisibility();

      window.dispatchEvent(new CustomEvent('ecosystemVisibilityChanged', {
        detail: { settings: this.currentSettings, isSuperAdmin: this.isSuperAdmin }
      }));

      return this.currentSettings;
    },

    applyVisibility() {
      const s = this.currentSettings;
      const isAdmin = this.isSuperAdmin;

      // 1. Phone number visibility (Show full phone ONLY if setting is ON OR if Super Admin is active)
      const phoneVisible = s.showPhoneNumber || isAdmin;

      document.querySelectorAll('[data-visibility="phone-text"]').forEach(el => {
        if (!phoneVisible) {
          el.setAttribute('data-original-phone', el.getAttribute('data-original-phone') || el.textContent);
          el.textContent = '+94 76 ••• •••• (Protected)';
        } else {
          el.textContent = el.getAttribute('data-original-phone') || 'Available upon verified recruiter request';
        }
      });

      document.querySelectorAll('[data-visibility="phone-link"]').forEach(el => {
        if (!phoneVisible) {
          el.setAttribute('data-original-href', el.getAttribute('data-original-href') || el.getAttribute('href') || 'mailto:ikaushalya101official@gmail.com?subject=Phone%20Number%20Inquiry');
          el.removeAttribute('href');
          el.style.pointerEvents = 'none';
          el.style.opacity = '0.7';
          el.setAttribute('title', 'Direct phone inquiry protected by Super Admin (Available upon request)');
        } else {
          const orig = el.getAttribute('data-original-href') || 'mailto:ikaushalya101official@gmail.com?subject=Phone%20Number%20Inquiry';
          el.setAttribute('href', orig);
          el.style.pointerEvents = '';
          el.style.opacity = '';
          el.setAttribute('title', 'Contact directly via verified inquiry');
        }
      });

      // 2. WhatsApp visibility (Show ONLY if setting is ON OR if Super Admin is active)
      const whatsAppVisible = s.showWhatsApp || isAdmin;
      document.querySelectorAll('[data-visibility="whatsapp-link"]').forEach(el => {
        if (!whatsAppVisible) {
          el.style.display = 'none';
        } else {
          el.style.display = '';
        }
      });

      // 3. Referee direct phone (Show ONLY if setting is ON OR if Super Admin is active)
      const refVisible = s.showRefereePhone || isAdmin;
      document.querySelectorAll('[data-visibility="referee-phone"]').forEach(el => {
        if (!refVisible) {
          el.innerHTML = '<span class="text-slate-400 italic">Available upon formal academic request</span>';
        } else {
          el.innerHTML = '<a href="mailto:ikaushalya101official@gmail.com?subject=Academic%20Referee%20Contact%20Request" class="text-cyan-300 hover:underline">Available upon formal academic request</a>';
        }
      });

      // 5. Admin Status Badges (if any element has data-admin-indicator)
      document.querySelectorAll('[data-admin-indicator]').forEach(el => {
        el.style.display = isAdmin ? '' : 'none';
      });
    }
  };

  window.EcosystemVisibility = EcosystemVisibility;

  // Auto initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => EcosystemVisibility.init());
  } else {
    EcosystemVisibility.init();
  }
})();
