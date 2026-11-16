/**
 * IMESH KAUSHALYA ECOSYSTEM - MULTI-THEME ENGINE
 * Shared cross-application theme controller for Portfolio, Life OS & GPA Hub
 */

const ECOSYSTEM_THEMES = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    badge: 'Obsidian Space',
    desc: 'Deep obsidian void & electric cyan (Default)',
    swatches: ['#070b14', '#06b6d4', '#22d3ee'],
    icon: '⚡'
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    badge: 'Hacker Noir',
    desc: 'Midnight noir & radiant cyber emerald',
    swatches: ['#02110c', '#10b981', '#34d399'],
    icon: '🌲'
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Amethyst',
    badge: 'Cosmic Nebula',
    desc: 'Deep cosmic violet & neon fuchsia',
    swatches: ['#0c0618', '#a855f7', '#c084fc'],
    icon: '🔮'
  },
  {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    badge: 'Royal Cobalt',
    desc: 'Deep oceanic abyss & electric cobalt',
    swatches: ['#030a1c', '#3b82f6', '#60a5fa'],
    icon: '🌊'
  },
  {
    id: 'tokyo-sunset',
    name: 'Tokyo Sunset',
    badge: 'Dark Magma',
    desc: 'Volcanic noir & blazing neon crimson/amber',
    swatches: ['#14050a', '#f43f5e', '#f59e0b'],
    icon: '🌇'
  },
  {
    id: 'nordic-titanium',
    name: 'Nordic Titanium',
    badge: 'Platinum Slate',
    desc: 'Aerospace titanium slate & arctic silver',
    swatches: ['#0b0f17', '#38bdf8', '#cbd5e1'],
    icon: '🛡️'
  }
];

function getEcosystemTheme() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTheme = urlParams.get('theme');
    if (urlTheme && ECOSYSTEM_THEMES.some(t => t.id === urlTheme.toLowerCase())) {
      const themeId = urlTheme.toLowerCase();
      localStorage.setItem('imesh_ecosystem_theme', themeId);
      return themeId;
    }
    const saved = localStorage.getItem('imesh_ecosystem_theme');
    if (saved && ECOSYSTEM_THEMES.some(t => t.id === saved)) {
      return saved;
    }
  } catch (e) {}
  return 'cyber-cyan';
}

function setEcosystemTheme(themeId, showToastNotification = true) {
  const themeObj = ECOSYSTEM_THEMES.find(t => t.id === themeId) || ECOSYSTEM_THEMES[0];
  const targetId = themeObj.id;

  try {
    localStorage.setItem('imesh_ecosystem_theme', targetId);
  } catch (e) {}

  document.documentElement.setAttribute('data-theme', targetId);
  if (document.body) {
    document.body.setAttribute('data-theme', targetId);
  }

  // Update all current theme labels across DOM
  const labels = document.querySelectorAll('.current-theme-label, #currentThemeLabelLife, #currentThemeLabelIndex, #currentThemeLabelGpa');
  labels.forEach(el => {
    el.textContent = themeObj.name;
  });

  // Update active state in any rendered dropdowns
  document.querySelectorAll('.eco-theme-item').forEach(item => {
    const tid = item.getAttribute('data-theme-id');
    if (tid === targetId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Dispatch custom event for app-specific handlers
  window.dispatchEvent(new CustomEvent('ecosystemThemeChanged', { detail: { theme: themeObj } }));

  if (showToastNotification && typeof window.showToast === 'function') {
    window.showToast(`Theme switched to ${themeObj.name} (${themeObj.badge})`);
  }
}

function renderThemeMenu(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentTheme = getEcosystemTheme();
  let html = '';

  ECOSYSTEM_THEMES.forEach(t => {
    const isActive = t.id === currentTheme;
    html += `
      <div class="eco-theme-item ${isActive ? 'active' : ''}" data-theme-id="${t.id}" onclick="setEcosystemTheme('${t.id}')">
        <div class="eco-theme-swatch">
          <span style="background:${t.swatches[0]}"></span>
          <span style="background:${t.swatches[1]}"></span>
          <span style="background:${t.swatches[2]}"></span>
        </div>
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; justify-content:space-between; gap:4px;">
            <span style="font-weight:700; font-size:12px; color:#ffffff;">${t.icon} ${t.name}</span>
            <span style="font-size:9px; font-family:monospace; padding:1px 6px; border-radius:6px; background:rgba(255,255,255,0.08); color:#94a3b8;">${t.badge}</span>
          </div>
          <div style="font-size:10px; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.desc}</div>
        </div>
        <div style="color:var(--eco-accent); font-weight:bold; font-size:13px; opacity:${isActive ? '1' : '0'};">✓</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function toggleThemeDropdown(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;

  // Close any other open dropdowns first
  document.querySelectorAll('.eco-theme-menu').forEach(m => {
    if (m.id !== menuId) m.classList.remove('active');
  });

  menu.classList.toggle('active');
}

// Global click outside to close dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-switcher-container') && !e.target.closest('.eco-theme-menu')) {
    document.querySelectorAll('.eco-theme-menu').forEach(m => m.classList.remove('active'));
  }
});

// Real-time synchronization across browser tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'imesh_ecosystem_theme' && e.newValue) {
    setEcosystemTheme(e.newValue, false);
  }
});

// Immediate application before paint to prevent flicker
(function() {
  const initialTheme = getEcosystemTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);
  if (document.body) document.body.setAttribute('data-theme', initialTheme);
})();

// Re-sync on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  const initialTheme = getEcosystemTheme();
  setEcosystemTheme(initialTheme, false);
  renderThemeMenu('themeOptionsListLife');
  renderThemeMenu('themeOptionsListIndex');
  renderThemeMenu('themeOptionsListGpa');

  if (window.location.search.includes('menu=theme')) {
    setTimeout(() => {
      const isLife = window.location.pathname.includes('life');
      const isGpa = window.location.pathname.includes('gpa');
      if (isLife) toggleThemeDropdown('themeDropdownMenuLife');
      else if (isGpa) toggleThemeDropdown('themeDropdownMenuGpa');
      else toggleThemeDropdown('themeDropdownMenuIndex');
    }, 350);
  }
});
