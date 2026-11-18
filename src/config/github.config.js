/**
 * GitHub Integration Configuration
 * Single source of truth configuration for the portfolio Projects section.
 */
export const GITHUB_CONFIG = {
  // Confirmed GitHub Username
  username: 'devpanda4real',

  // Profile README repositories to hide (e.g. username/username or personal alias)
  profileReadmeRepos: ['devpanda4real', 'Imesh008'],

  // Explicitly hidden repositories (empty by default; all public repos are shown)
  hiddenRepos: [],

  // Exclude forked repositories (defaults to true)
  excludeForks: true,

  // Cache duration in minutes for browser sessionStorage
  cacheDurationMinutes: 10,

  // Keep the flagship capstone card (Luxora) in the Projects section
  showFlagshipCapstone: true
};
