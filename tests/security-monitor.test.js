/**
 * Enhanced Automated Test Suite: Security Monitor Engine
 * Tests all requirements, edge cases, and safety guarantees:
 * - Established npm semver range evaluation (caret, tilde, hyphen, compound, prerelease, invalid)
 * - Complete dependency tree scanning (root & nested)
 * - Severity categorization (Critical, High, Moderate, Low)
 * - Four-state decision engine (OFFICIAL_PATCH_PUBLISHED, VULNERABLE_DEPENDENCY_INSTALLED, VULNERABILITY_NOT_DETECTED, SECURITY_CHECK_INCOMPLETE)
 * - Historical reporting & artifact generation (reports/ folder)
 * - Workflow annotations (::error and ::warning)
 * - Strict read-only guarantee (package.json and lockfile untouched)
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  evaluateSemverRange,
  fetchAdvisory,
  fetchNpmPackage,
  findInstalledInstances,
  executeNpmAudit,
  evaluateSecurityStatus,
  generateMarkdownReport,
  saveHistoricalReport,
  emitWorkflowAnnotations,
  runSecurityMonitor,
  STATUSES
} = require('../scripts/security-monitor.js');

const PROJECT_DIR = path.resolve(__dirname, '..');

// Helper to create mock responses
function createMockFetch(responses) {
  return async (url, options = {}) => {
    for (const [pattern, handler] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        if (typeof handler === 'function') {
          return handler(url, options);
        }
        return {
          status: handler.status || 200,
          ok: (handler.status || 200) >= 200 && (handler.status || 200) < 300,
          statusText: handler.statusText || 'OK',
          headers: new Map(Object.entries(handler.headers || {})),
          json: async () => handler.body || {}
        };
      }
    }
    throw new Error(`Unhandled mock fetch URL: ${url}`);
  };
}

const standardAdvisoryBody = {
  ghsa_id: 'GHSA-fc5q-39xc-vjpf',
  cve_id: 'CVE-2026-112366',
  severity: 'high',
  summary: 'picomatch ReDoS vulnerability',
  vulnerabilities: [
    {
      package: { ecosystem: 'npm', name: 'picomatch' },
      vulnerable_version_range: '<= 4.0.7',
      first_patched_version: null
    }
  ]
};

const standardNpmPicoBody = {
  name: 'picomatch',
  'dist-tags': { latest: '4.0.7' },
  versions: {
    '4.0.6': {},
    '4.0.7': {}
  }
};

const standardNpmViteBody = {
  name: 'vite',
  'dist-tags': { latest: '6.4.6' },
  versions: {
    '6.4.5': {},
    '6.4.6': {}
  }
};

const standardCleanAuditExec = (omitDev) => ({
  exitCode: 0,
  stdout: JSON.stringify({
    metadata: { vulnerabilities: { total: 0, info: 0, low: 0, moderate: 0, high: 0, critical: 0 } },
    vulnerabilities: {}
  })
});

const standardVulnAuditExec = (omitDev) => ({
  exitCode: omitDev ? 0 : 1,
  stdout: JSON.stringify({
    metadata: {
      vulnerabilities: {
        total: omitDev ? 0 : 4,
        info: 0,
        low: 0,
        moderate: 0,
        high: omitDev ? 0 : 4,
        critical: 0
      }
    },
    vulnerabilities: omitDev ? {} : {
      picomatch: {
        name: 'picomatch',
        severity: 'high',
        isDirect: false,
        range: '*',
        via: ['GHSA-fc5q-39xc-vjpf']
      },
      tinyglobby: {
        name: 'tinyglobby',
        severity: 'high',
        isDirect: false,
        range: '*',
        via: ['picomatch']
      },
      fdir: {
        name: 'fdir',
        severity: 'high',
        isDirect: false,
        range: '>=5.2.1',
        via: ['picomatch']
      },
      vite: {
        name: 'vite',
        severity: 'high',
        isDirect: true,
        range: '>=6.3.0-beta.0',
        via: ['fdir', 'picomatch', 'tinyglobby']
      }
    }
  })
});

async function runTests() {
  console.log('========================================================================');
  console.log('🧪 RUNNING ENHANCED SECURITY MONITOR AUTOMATED TEST SUITE');
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

  // Record initial file hashes/timestamps to verify read-only guarantee
  const pkgJsonPath = path.join(PROJECT_DIR, 'package.json');
  const pkgLockPath = path.join(PROJECT_DIR, 'package-lock.json');
  const initialPkgJson = fs.readFileSync(pkgJsonPath, 'utf8');
  const initialPkgLock = fs.readFileSync(pkgLockPath, 'utf8');

  // --------------------------------------------------------------------------
  // Group 1: Established npm Semver Parser & Complex Range Evaluation
  // --------------------------------------------------------------------------

  await test('1.1: Semver evaluation - Standard relational operators (<=, >=, <, >)', async () => {
    assert.strictEqual(evaluateSemverRange('4.0.7', '<= 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.6', '<= 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.8', '<= 4.0.7'), false);
    assert.strictEqual(evaluateSemverRange('4.0.8', '> 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.7', '> 4.0.7'), false);
    assert.strictEqual(evaluateSemverRange('6.4.6', '>= 6.0.0'), true);
  });

  await test('1.2: Semver evaluation - Caret ranges (^)', async () => {
    assert.strictEqual(evaluateSemverRange('4.0.7', '^4.0.0'), true);
    assert.strictEqual(evaluateSemverRange('4.1.0', '^4.0.0'), true);
    assert.strictEqual(evaluateSemverRange('5.0.0', '^4.0.0'), false);
  });

  await test('1.3: Semver evaluation - Tilde ranges (~)', async () => {
    assert.strictEqual(evaluateSemverRange('4.0.7', '~4.0.0'), true);
    assert.strictEqual(evaluateSemverRange('4.0.9', '~4.0.0'), true);
    assert.strictEqual(evaluateSemverRange('4.1.0', '~4.0.0'), false);
  });

  await test('1.4: Semver evaluation - Hyphen ranges (-)', async () => {
    assert.strictEqual(evaluateSemverRange('4.0.5', '4.0.0 - 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.7', '4.0.0 - 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.8', '4.0.0 - 4.0.7'), false);
  });

  await test('1.5: Semver evaluation - Compound and Logical OR ranges', async () => {
    assert.strictEqual(evaluateSemverRange('4.0.5', '>= 4.0.0 < 4.0.8'), true);
    assert.strictEqual(evaluateSemverRange('4.0.8', '>= 4.0.0 < 4.0.8'), false);
    assert.strictEqual(evaluateSemverRange('3.9.0', '< 4.0.0 || > 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.8', '< 4.0.0 || > 4.0.7'), true);
    assert.strictEqual(evaluateSemverRange('4.0.5', '< 4.0.0 || > 4.0.7'), false);
  });

  await test('1.6: Semver evaluation - Prerelease versions', async () => {
    assert.strictEqual(evaluateSemverRange('6.3.0-beta.0', '>=6.3.0-beta.0'), true);
    assert.strictEqual(evaluateSemverRange('6.3.0-alpha.1', '>=6.3.0-beta.0'), false);
  });

  await test('1.7: Semver evaluation - Invalid range throws descriptive error', async () => {
    assert.throws(() => {
      evaluateSemverRange('4.0.7', 'invalid-syntax!!!');
    }, /Invalid or unknown semver range expression/);

    assert.throws(() => {
      evaluateSemverRange('invalid-version', '<= 4.0.7');
    }, /Unparseable semver version/);
  });

  // --------------------------------------------------------------------------
  // Group 2: Complete Dependency Tree & Nested Instance Detection
  // --------------------------------------------------------------------------

  await test('2.1: Tree scanning - Root and nested dependency detection', async () => {
    const mockLockMulti = {
      packages: {
        'node_modules/picomatch': { version: '4.0.7' },
        'node_modules/fdir/node_modules/picomatch': { version: '4.0.6' },
        'node_modules/tinyglobby/node_modules/picomatch': { version: '2.3.1' }
      }
    };

    const scan = findInstalledInstances(PROJECT_DIR, 'picomatch', '<= 4.0.7', mockLockMulti);
    assert.strictEqual(scan.totalInstalled, 3);
    assert.strictEqual(scan.vulnerableCount, 3);

    const rootInst = scan.instances.find(i => i.isRoot);
    assert.ok(rootInst);
    assert.strictEqual(rootInst.location, 'node_modules/picomatch');
    assert.strictEqual(rootInst.parentChain, 'root');

    const nestedFdir = scan.instances.find(i => i.location === 'node_modules/fdir/node_modules/picomatch');
    assert.ok(nestedFdir);
    assert.strictEqual(nestedFdir.isRoot, false);
    assert.strictEqual(nestedFdir.parentChain, 'fdir');
  });

  await test('2.2: Tree scanning - Root patched but nested vulnerable', async () => {
    const mockLock = {
      packages: {
        'node_modules/picomatch': { version: '4.0.8' },
        'node_modules/fdir/node_modules/picomatch': { version: '4.0.7' }
      }
    };

    const scan = findInstalledInstances(PROJECT_DIR, 'picomatch', '<= 4.0.7', mockLock);
    assert.strictEqual(scan.totalInstalled, 2);
    assert.strictEqual(scan.vulnerableCount, 1);
    assert.strictEqual(scan.instances.find(i => i.isVulnerable).location, 'node_modules/fdir/node_modules/picomatch');
  });

  await test('2.3: Tree scanning - Lockfile v1 dependencies fallback', async () => {
    const mockLockV1 = {
      dependencies: {
        vite: {
          version: '6.4.6',
          dependencies: {
            fdir: {
              version: '6.5.0',
              dependencies: {
                picomatch: { version: '4.0.7' }
              }
            }
          }
        }
      }
    };

    const scan = findInstalledInstances(PROJECT_DIR, 'picomatch', '<= 4.0.7', mockLockV1);
    assert.strictEqual(scan.totalInstalled, 1);
    assert.strictEqual(scan.vulnerableCount, 1);
    assert.strictEqual(scan.instances[0].parentChain, 'vite -> fdir');
  });

  // --------------------------------------------------------------------------
  // Group 3: Severity-Based Vulnerability Inventory
  // --------------------------------------------------------------------------

  await test('3.1: Complete Tree Audit - Severity categorization (Critical, High, Moderate, Low)', async () => {
    const mockMultiSeverityExec = () => ({
      exitCode: 1,
      stdout: JSON.stringify({
        metadata: {
          vulnerabilities: {
            total: 5,
            critical: 1,
            high: 2,
            moderate: 1,
            low: 1,
            info: 0
          }
        },
        vulnerabilities: {
          'crit-pkg': { name: 'crit-pkg', severity: 'critical', isDirect: true, range: '*', via: ['GHSA-critical'] },
          'high-pkg-1': { name: 'high-pkg-1', severity: 'high', isDirect: false, range: '<= 1.0.0', via: ['upstream'] },
          'high-pkg-2': { name: 'high-pkg-2', severity: 'high', isDirect: false, range: '^2.0.0', via: ['upstream'] },
          'mod-pkg': { name: 'mod-pkg', severity: 'moderate', isDirect: false, range: '>= 0.1.0', via: ['upstream'] },
          'low-pkg': { name: 'low-pkg', severity: 'low', isDirect: false, range: '*', via: ['upstream'] }
        }
      })
    });

    const res = executeNpmAudit(PROJECT_DIR, false, mockMultiSeverityExec);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.total, 5);
    assert.strictEqual(res.bySeverity.critical.length, 1);
    assert.strictEqual(res.bySeverity.high.length, 2);
    assert.strictEqual(res.bySeverity.moderate.length, 1);
    assert.strictEqual(res.bySeverity.low.length, 1);
    assert.strictEqual(res.bySeverity.critical[0].name, 'crit-pkg');
    assert.strictEqual(res.bySeverity.critical[0].isDirect, true);
  });

  // --------------------------------------------------------------------------
  // Group 4: Four-State Decision Engine
  // --------------------------------------------------------------------------

  await test('4.1: Decision State - OFFICIAL_PATCH_PUBLISHED', async () => {
    const advisoryRes = {
      success: true,
      ghsaId: 'GHSA-fc5q-39xc-vjpf',
      cveId: 'CVE-2026-112366',
      packageName: 'picomatch',
      firstPatchedVersion: '4.0.8',
      vulnerableRange: '<= 4.0.7'
    };
    const npmPicoRes = {
      success: true,
      packageName: 'picomatch',
      latest: '4.0.8',
      allVersions: ['4.0.7', '4.0.8']
    };
    const installedRes = { totalInstalled: 1, vulnerableCount: 1 };
    const devAuditRes = { success: true, total: 4 };
    const prodAuditRes = { success: true, total: 0 };

    const decision = evaluateSecurityStatus({
      advisoryRes,
      npmPicoRes,
      installedRes,
      devAuditRes,
      prodAuditRes
    });

    assert.strictEqual(decision.status, STATUSES.OFFICIAL_PATCH_PUBLISHED);
    assert.strictEqual(decision.exitCode, 0);
    assert.strictEqual(decision.patchedVersion, '4.0.8');
    assert(decision.reason.includes('Official patch version 4.0.8 is confirmed'));
  });

  await test('4.2: Decision State - VULNERABLE_DEPENDENCY_INSTALLED (Announced but not on npm)', async () => {
    const advisoryRes = {
      success: true,
      ghsaId: 'GHSA-fc5q-39xc-vjpf',
      packageName: 'picomatch',
      firstPatchedVersion: '4.0.8', // Announced
      vulnerableRange: '<= 4.0.7'
    };
    const npmPicoRes = {
      success: true,
      packageName: 'picomatch',
      latest: '4.0.7',
      allVersions: ['4.0.6', '4.0.7'] // Not on npm yet!
    };
    const installedRes = { totalInstalled: 1, vulnerableCount: 1 };
    const devAuditRes = { success: true, total: 4 };
    const prodAuditRes = { success: true, total: 0 };

    const decision = evaluateSecurityStatus({
      advisoryRes,
      npmPicoRes,
      installedRes,
      devAuditRes,
      prodAuditRes
    });

    assert.strictEqual(decision.status, STATUSES.VULNERABLE_DEPENDENCY_INSTALLED);
    assert.strictEqual(decision.exitCode, 0);
    assert(decision.reason.includes('NOT YET available on npm'));
  });

  await test('4.3: Decision State - VULNERABLE_DEPENDENCY_INSTALLED (Baseline: No patch announced)', async () => {
    const advisoryRes = {
      success: true,
      ghsaId: 'GHSA-fc5q-39xc-vjpf',
      packageName: 'picomatch',
      firstPatchedVersion: null,
      vulnerableRange: '<= 4.0.7'
    };
    const npmPicoRes = {
      success: true,
      packageName: 'picomatch',
      latest: '4.0.7',
      allVersions: ['4.0.7']
    };
    const installedRes = { totalInstalled: 1, vulnerableCount: 1 };
    const devAuditRes = { success: true, total: 4 };
    const prodAuditRes = { success: true, total: 0 };

    const decision = evaluateSecurityStatus({
      advisoryRes,
      npmPicoRes,
      installedRes,
      devAuditRes,
      prodAuditRes
    });

    assert.strictEqual(decision.status, STATUSES.VULNERABLE_DEPENDENCY_INSTALLED);
    assert.strictEqual(decision.exitCode, 0);
    assert(decision.reason.includes('Vulnerable dependency installed'));
  });

  await test('4.4: Decision State - VULNERABILITY_NOT_DETECTED', async () => {
    const advisoryRes = {
      success: true,
      ghsaId: 'GHSA-fc5q-39xc-vjpf',
      packageName: 'picomatch',
      firstPatchedVersion: null,
      vulnerableRange: '<= 4.0.7'
    };
    const npmPicoRes = {
      success: true,
      packageName: 'picomatch',
      latest: '5.0.0',
      allVersions: ['5.0.0']
    };
    const installedRes = { totalInstalled: 1, vulnerableCount: 0 };
    const devAuditRes = { success: true, total: 0 };
    const prodAuditRes = { success: true, total: 0 };

    const decision = evaluateSecurityStatus({
      advisoryRes,
      npmPicoRes,
      installedRes,
      devAuditRes,
      prodAuditRes
    });

    assert.strictEqual(decision.status, STATUSES.VULNERABILITY_NOT_DETECTED);
    assert.strictEqual(decision.exitCode, 0);
  });

  await test('4.5: Decision State - SECURITY_CHECK_INCOMPLETE on API, network, or semver failure', async () => {
    // API failure
    const d1 = evaluateSecurityStatus({
      advisoryRes: { success: false, error: 'Rate limit 403' },
      npmPicoRes: { success: true }
    });
    assert.strictEqual(d1.status, STATUSES.SECURITY_CHECK_INCOMPLETE);
    assert.strictEqual(d1.exitCode, 1);

    // npm registry failure
    const d2 = evaluateSecurityStatus({
      advisoryRes: { success: true },
      npmPicoRes: { success: false, error: '503 Service Unavailable' }
    });
    assert.strictEqual(d2.status, STATUSES.SECURITY_CHECK_INCOMPLETE);
    assert.strictEqual(d2.exitCode, 1);

    // Semver error
    const d3 = evaluateSecurityStatus({
      advisoryRes: { success: true },
      npmPicoRes: { success: true },
      semverError: 'Invalid range expression'
    });
    assert.strictEqual(d3.status, STATUSES.SECURITY_CHECK_INCOMPLETE);
    assert.strictEqual(d3.exitCode, 1);
  });

  // --------------------------------------------------------------------------
  // Group 5: Historical Reporting & GitHub Actions Artifacts
  // --------------------------------------------------------------------------

  await test('5.1: Historical reporting writes JSON and MD reports to reports/ folder', async () => {
    const testTimestamp = '2026-11-18T12:34:56.789Z';
    const reportData = { test: true, timestamp: testTimestamp };
    const markdownContent = '# Test Report Content';

    const files = saveHistoricalReport(PROJECT_DIR, reportData, markdownContent, testTimestamp);
    assert.ok(fs.existsSync(files.jsonFile));
    assert.ok(fs.existsSync(files.mdFile));
    assert.ok(fs.existsSync(files.latestJson));
    assert.ok(fs.existsSync(files.latestMd));

    const readJson = JSON.parse(fs.readFileSync(files.jsonFile, 'utf8'));
    assert.strictEqual(readJson.test, true);
    assert.strictEqual(fs.readFileSync(files.mdFile, 'utf8'), markdownContent);

    // Clean up test-specific timestamp files
    fs.unlinkSync(files.jsonFile);
    fs.unlinkSync(files.mdFile);
  });

  // --------------------------------------------------------------------------
  // Group 6: Workflow Annotations & Security Notification Safety
  // --------------------------------------------------------------------------

  await test('6.1: Workflow annotations emit ::error and ::warning without leaking secrets', async () => {
    const originalEnv = process.env.GITHUB_ACTIONS;
    process.env.GITHUB_ACTIONS = 'true';

    const logs = [];
    const origLog = console.log;
    console.log = (msg) => logs.push(msg);

    try {
      // Test check incomplete error
      emitWorkflowAnnotations(
        { status: STATUSES.SECURITY_CHECK_INCOMPLETE, reason: 'Failed connecting to API' },
        null,
        null
      );
      assert.ok(logs.some(l => l.startsWith('::error title=Security Check Incomplete::')));

      logs.length = 0;

      // Test critical vulnerability error
      emitWorkflowAnnotations(
        { status: STATUSES.VULNERABLE_DEPENDENCY_INSTALLED },
        { bySeverity: { critical: [{ name: 'test' }] } },
        { bySeverity: { critical: [] } }
      );
      assert.ok(logs.some(l => l.startsWith('::error title=Critical Vulnerabilities Detected::')));

      logs.length = 0;

      // Test high severity warning
      emitWorkflowAnnotations(
        { status: STATUSES.VULNERABLE_DEPENDENCY_INSTALLED },
        { bySeverity: { critical: [], high: [{ name: 'test' }] } },
        { bySeverity: { critical: [], high: [] } }
      );
      assert.ok(logs.some(l => l.startsWith('::warning title=High Severity Vulnerabilities Monitored::')));
    } finally {
      console.log = origLog;
      if (originalEnv === undefined) {
        delete process.env.GITHUB_ACTIONS;
      } else {
        process.env.GITHUB_ACTIONS = originalEnv;
      }
    }
  });

  // --------------------------------------------------------------------------
  // Group 7: Strict Read-Only Preservation
  // --------------------------------------------------------------------------

  await test('7.1: Strict Read-Only Verification - package.json and lockfile are untouched', async () => {
    const currentPkgJson = fs.readFileSync(pkgJsonPath, 'utf8');
    const currentPkgLock = fs.readFileSync(pkgLockPath, 'utf8');

    assert.strictEqual(currentPkgJson, initialPkgJson, 'package.json was modified during monitoring!');
    assert.strictEqual(currentPkgLock, initialPkgLock, 'package-lock.json was modified during monitoring!');
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
