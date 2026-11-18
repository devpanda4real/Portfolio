/**
 * GitHub REST API Service
 * Fetches and caches public repositories for the single-source-of-truth portfolio.
 */
import { GITHUB_CONFIG } from '../config/github.config.js';

const CACHE_KEY_PREFIX = 'portfolio_github_repos_';

/**
 * Maps a programming language to a suitable file extension for the window header mockup.
 */
export function getLanguageFileExtension(language, repoName) {
  if (!language) return `${repoName}.md`;
  const normalized = language.toLowerCase();
  switch (normalized) {
    case 'python':
      return `${repoName}.py`;
    case 'java':
      return `${repoName}.java`;
    case 'javascript':
      return `${repoName}.js`;
    case 'typescript':
      return `${repoName}.ts`;
    case 'html':
      return `${repoName}.html`;
    case 'css':
      return `${repoName}.css`;
    case 'c++':
    case 'cpp':
      return `${repoName}.cpp`;
    case 'c#':
    case 'csharp':
      return `${repoName}.cs`;
    case 'go':
      return `${repoName}.go`;
    case 'rust':
      return `${repoName}.rs`;
    case 'ruby':
      return `${repoName}.rb`;
    case 'php':
      return `${repoName}.php`;
    case 'shell':
    case 'bash':
      return `${repoName}.sh`;
    default:
      return `${repoName}.${normalized.slice(0, 3)}`;
  }
}

/**
 * Formats an ISO 8601 date string into a readable date (e.g. "Nov 16, 2026").
 */
export function formatRepoDate(isoDateString) {
  if (!isoDateString) return 'Recently';
  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Reads valid cached repositories from sessionStorage.
 */
function getCachedRepos(username) {
  if (typeof window === 'undefined' || !window.sessionStorage) return null;
  try {
    const raw = window.sessionStorage.getItem(`${CACHE_KEY_PREFIX}${username}`);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    const ttlMs = (GITHUB_CONFIG.cacheDurationMinutes || 10) * 60 * 1000;
    const age = Date.now() - entry.timestamp;
    if (age < ttlMs && Array.isArray(entry.repos)) {
      return { repos: entry.repos, isStale: false };
    }
    // Return stale cache if expired (as safety fallback)
    return { repos: entry.repos, isStale: true };
  } catch {
    return null;
  }
}

/**
 * Saves fetched repositories to sessionStorage.
 */
function setCachedRepos(username, repos) {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    const entry = {
      timestamp: Date.now(),
      repos
    };
    window.sessionStorage.setItem(`${CACHE_KEY_PREFIX}${username}`, JSON.stringify(entry));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Fetches public repositories from the official GitHub REST API v3.
 * 
 * @param {string} [username] GitHub username (defaults to GITHUB_CONFIG.username)
 * @param {boolean} [forceRefresh=false] Bypass cache if true
 * @param {Function} [customFetch] Optional custom fetch implementation for unit testing
 * @returns {Promise<Array>} Sorted and sanitized public repositories
 */
export async function fetchPublicRepos(username = GITHUB_CONFIG.username, forceRefresh = false, customFetch = null) {
  const fetchFn = customFetch || (typeof window !== 'undefined' ? window.fetch.bind(window) : fetch);

  // 1. Check browser cache unless forced refresh
  if (!forceRefresh) {
    const cached = getCachedRepos(username);
    if (cached && !cached.isStale) {
      return cached.repos;
    }
  }

  const endpoint = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&direction=desc&per_page=100`;
  const requestOptions = {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  };

  let response;
  try {
    response = await fetchFn(endpoint, requestOptions);
  } catch (netErr) {
    // Attempt to serve stale cache during network outages
    const stale = getCachedRepos(username);
    if (stale && stale.repos && stale.repos.length > 0) {
      return stale.repos;
    }
    throw new Error('Network connection issue. Unable to reach GitHub API.');
  }

  if (response.status === 403) {
    // Attempt to serve stale cache when rate-limited
    const stale = getCachedRepos(username);
    if (stale && stale.repos && stale.repos.length > 0) {
      return stale.repos;
    }
    throw new Error('GitHub API rate limit reached. Please try again shortly.');
  }

  if (response.status === 404) {
    throw new Error(`GitHub user "${username}" was not found.`);
  }

  if (!response.ok) {
    throw new Error(`GitHub API returned HTTP ${response.status}.`);
  }

  const raw = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error('Unexpected data format received from GitHub API.');
  }

  const profileReadmeRepos = GITHUB_CONFIG.profileReadmeRepos || [];
  const hiddenRepos = GITHUB_CONFIG.hiddenRepos || [];
  const excludeForks = GITHUB_CONFIG.excludeForks !== false;

  // Filter public, non-fork, non-profile-readme repositories
  const filtered = raw.filter((repo) => {
    // Only public repositories
    if (repo.private) return false;

    // Exclude forks by default
    if (excludeForks && repo.fork) return false;

    // Hide profile README repos (e.g. devpanda4real/devpanda4real or alias Imesh008)
    if (profileReadmeRepos.includes(repo.name)) return false;

    // Hide explicitly configured repos
    if (hiddenRepos.includes(repo.name)) return false;

    return true;
  });

  // Strict sort by pushed_at descending (most recent code activity first)
  filtered.sort((a, b) => {
    const timeA = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
    const timeB = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
    return timeB - timeA;
  });

  const sanitized = filtered.map((repo) => ({
    id: `gh-${repo.id}`,
    name: repo.name,
    fileName: getLanguageFileExtension(repo.language, repo.name),
    description: repo.description || 'Public GitHub repository showcasing software engineering work and code experimentation.',
    language: repo.language || 'Other',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    formattedPushedDate: formatRepoDate(repo.pushed_at),
    htmlUrl: repo.html_url,
    homepage: repo.homepage || null,
    isFork: Boolean(repo.fork),
    role: 'Open Source / Author',
    projectType: 'GitHub Repository'
  }));

  // Save to browser cache
  setCachedRepos(username, sanitized);

  return sanitized;
}
