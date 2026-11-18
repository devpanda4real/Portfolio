/**
 * Automated Test Suite: GitHub Integration (Single Source of Truth)
 * Tests:
 * 1. Fetching public repositories for devpanda4real
 * 2. Sorting by pushed_at descending (most recent code activity)
 * 3. Hiding profile README repos (devpanda4real, Imesh008)
 * 4. Excluding forks
 * 5. Formatting language file extensions and dates
 * 6. Rate-limit (HTTP 403) and network error resilience
 * 7. Live GitHub API verification
 * 8. Preservation of existing academic capstone data
 */

import assert from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  fetchPublicRepos,
  getLanguageFileExtension,
  formatRepoDate
} from '../src/services/github.js';
import { GITHUB_CONFIG } from '../src/config/github.config.js';
import { projectsData } from '../src/data/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper for mocking fetch
function createMockFetch(routes) {
  return async (url, options = {}) => {
    for (const [pattern, handler] of Object.entries(routes)) {
      if (url.includes(pattern)) {
        if (typeof handler === 'function') {
          return handler(url, options);
        }
        return {
          status: handler.status || 200,
          ok: (handler.status || 200) >= 200 && (handler.status || 200) < 300,
          statusText: handler.statusText || 'OK',
          json: async () => handler.body || []
        };
      }
    }
    throw new Error(`Unhandled URL in mock fetch: ${url}`);
  };
}

async function runTests() {
  console.log('========================================================================');
  console.log('🧪 RUNNING GITHUB SINGLE-SOURCE-OF-TRUTH TEST SUITE');
  console.log('========================================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      console.error(err.stack);
      failed++;
    }
  }

  // 1: Verify configured username
  await test('1: GITHUB_CONFIG specifies devpanda4real as confirmed username', async () => {
    assert.strictEqual(GITHUB_CONFIG.username, 'devpanda4real');
    assert.ok(GITHUB_CONFIG.profileReadmeRepos.includes('Imesh008'));
    assert.ok(GITHUB_CONFIG.profileReadmeRepos.includes('devpanda4real'));
    assert.strictEqual(GITHUB_CONFIG.excludeForks, true);
  });

  // 2: Sorting by pushed_at descending
  await test('2: Repositories are strictly sorted by pushed_at descending', async () => {
    const mockData = [
      {
        id: 1,
        name: 'older-repo',
        pushed_at: '2025-01-01T10:00:00Z',
        private: false,
        fork: false,
        language: 'Python'
      },
      {
        id: 2,
        name: 'newest-repo',
        pushed_at: '2026-11-16T12:00:00Z',
        private: false,
        fork: false,
        language: 'JavaScript'
      },
      {
        id: 3,
        name: 'middle-repo',
        pushed_at: '2026-04-20T08:00:00Z',
        private: false,
        fork: false,
        language: 'Java'
      }
    ];

    const mockFetch = createMockFetch({
      'users/devpanda4real/repos': { status: 200, body: mockData }
    });

    const repos = await fetchPublicRepos('devpanda4real', true, mockFetch);
    assert.strictEqual(repos.length, 3);
    assert.strictEqual(repos[0].name, 'newest-repo');
    assert.strictEqual(repos[1].name, 'middle-repo');
    assert.strictEqual(repos[2].name, 'older-repo');
  });

  // 3: Filtering profile README repos and forks
  await test('3: Profile README repos and forks are strictly excluded', async () => {
    const mockData = [
      { id: 10, name: 'Imesh008', private: false, fork: false, pushed_at: '2026-04-22T06:54:28Z' },
      { id: 11, name: 'devpanda4real', private: false, fork: false, pushed_at: '2026-04-22T06:54:28Z' },
      { id: 12, name: 'forked-repo', private: false, fork: true, pushed_at: '2026-04-22T06:54:28Z' },
      { id: 13, name: 'valid-repo', private: false, fork: false, pushed_at: '2026-04-22T06:54:28Z', language: 'Java' }
    ];

    const mockFetch = createMockFetch({
      'users/devpanda4real/repos': { status: 200, body: mockData }
    });

    const repos = await fetchPublicRepos('devpanda4real', true, mockFetch);
    assert.strictEqual(repos.length, 1);
    assert.strictEqual(repos[0].name, 'valid-repo');
  });

  // 4: Helper functions (Language extension and Date formatting)
  await test('4: Language extension and date formatting functions operate accurately', async () => {
    assert.strictEqual(getLanguageFileExtension('Python', 'Basic_python'), 'Basic_python.py');
    assert.strictEqual(getLanguageFileExtension('Java', 'JAVA'), 'JAVA.java');
    assert.strictEqual(getLanguageFileExtension('JavaScript', 'Portfolio'), 'Portfolio.js');
    assert.strictEqual(getLanguageFileExtension(null, 'Documentation'), 'Documentation.md');

    const formatted = formatRepoDate('2026-11-16T13:31:40Z');
    assert.ok(formatted.includes('2026'));
    assert.ok(formatted.includes('Nov'));
  });

  // 5: Rate limit error handling
  await test('5: HTTP 403 triggers a friendly rate limit error message', async () => {
    const mockFetch = createMockFetch({
      'users/devpanda4real/repos': { status: 403, statusText: 'Forbidden' }
    });

    await assert.rejects(async () => {
      await fetchPublicRepos('devpanda4real', true, mockFetch);
    }, /rate limit/i);
  });

  // 6: Network error handling
  await test('6: Network error throws a clean user-facing error message', async () => {
    const mockFetch = async () => {
      throw new Error('Failed to fetch');
    };

    await assert.rejects(async () => {
      await fetchPublicRepos('devpanda4real', true, mockFetch);
    }, /Network connection issue/i);
  });

  // 7: Live GitHub API test for devpanda4real
  await test('7: Live GitHub REST API retrieves real public repositories for devpanda4real', async () => {
    try {
      const liveRepos = await fetchPublicRepos('devpanda4real', true, fetch);
      assert.ok(Array.isArray(liveRepos));
      assert.ok(liveRepos.length > 0, 'Should find at least 1 repository');
      
      console.log(`      • Discovered ${liveRepos.length} public repos: ${liveRepos.map(r => `${r.name} (${r.language})`).join(', ')}`);
      
      // Verify that profile README repo Imesh008 is hidden
      assert.ok(!liveRepos.some(r => r.name === 'Imesh008'), 'Imesh008 profile repo should be filtered out');

      // Verify Portfolio is most recent
      assert.strictEqual(liveRepos[0].name, 'Portfolio', 'Portfolio should be first as most recently pushed');
    } catch (err) {
      if (err.message.includes('rate limit')) {
        console.log('      ⚠️ Live fetch rate-limited; verified via mock.');
      } else {
        throw err;
      }
    }
  });

  // 8: Capstone data intact
  await test('8: Academic capstone data (Luxora) remains intact', async () => {
    const luxora = projectsData.find(p => p.id === 'luxora');
    assert.ok(luxora, 'Luxora capstone should exist');
    assert.strictEqual(luxora.metrics.frCount, 71);
    assert.strictEqual(luxora.metrics.nfrCount, 23);
    assert.strictEqual(luxora.metrics.brCount, 25);
  });

  console.log('\n========================================================================');
  console.log(`📊 TEST SUITE SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
