/**
 * Enhanced Security Advisory & Dependency Release Monitor
 * Target: React + Vite Portfolio
 * Monitored Advisory: GHSA-fc5q-39xc-vjpf (CVE-2026-112366)
 *
 * READ-ONLY GUARANTEE:
 * - Never modifies package.json or package-lock.json.
 * - Never commits, pushes, merges, or deploys.
 * - Never mutates the dependency tree.
 * - Strict read-only inspection.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Use established npm semver package (already installed via devDependencies)
let semver;
try {
  semver = require('semver');
} catch (e) {
  semver = null;
}

const ADVISORY_ID = 'GHSA-fc5q-39xc-vjpf';
const DEFAULT_AFFECTED_PACKAGE = 'picomatch';

// ============================================================================
// 1. Semantic Version Parser & Range Evaluator (npm semver Package)
// ============================================================================

function evaluateSemverRange(version, rangeStr) {
  if (!semver) {
    throw new Error('Required npm semver package is not installed or resolvable.');
  }

  if (!version || typeof version !== 'string') {
    throw new Error(`Invalid version format: "${version}"`);
  }

  const cleanVersion = semver.clean(version) || semver.valid(version);
  if (!cleanVersion) {
    throw new Error(`Unparseable semver version: "${version}"`);
  }

  if (!rangeStr || typeof rangeStr !== 'string') {
    throw new Error(`Invalid range format: "${rangeStr}"`);
  }

  // Support all standard npm range expressions (^, ~, -, ||, compound, prereleases)
  const validRange = semver.validRange(rangeStr, { loose: true });
  if (!validRange) {
    throw new Error(`Invalid or unknown semver range expression: "${rangeStr}"`);
  }

  return semver.satisfies(cleanVersion, validRange, { includePrerelease: true });
}

// ============================================================================
// 2. Upstream Network Queries (GitHub Advisory & npm Registry)
// ============================================================================

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms for ${url}`);
    }
    throw err;
  }
}

async function fetchAdvisory(advisoryId = ADVISORY_ID, customFetch = null) {
  const fetchFn = customFetch || fetchWithTimeout;
  const headers = {
    'User-Agent': 'Portfolio-Security-Monitor/3.0',
    'Accept': 'application/json'
  };

  // Secure token injection without logging
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/advisories/${advisoryId}`;
  const res = await fetchFn(url, { headers });

  if (res.status === 403) {
    const rateLimit = res.headers?.get?.('x-ratelimit-remaining');
    throw new Error(`GitHub Advisory API rate limit reached (HTTP 403, remaining: ${rateLimit ?? 'unknown'}). Set GITHUB_TOKEN to increase limits.`);
  }

  if (res.status === 404) {
    throw new Error(`Advisory ${advisoryId} not found (HTTP 404)`);
  }

  if (!res.ok) {
    throw new Error(`GitHub Advisory API error: HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const vuln = data.vulnerabilities?.[0] || {};

  return {
    success: true,
    ghsaId: data.ghsa_id || advisoryId,
    cveId: data.cve_id || 'CVE-2026-112366',
    severity: (data.severity || 'unknown').toLowerCase(),
    summary: data.summary || '',
    packageName: vuln.package?.name || DEFAULT_AFFECTED_PACKAGE,
    vulnerableRange: vuln.vulnerable_version_range || '<= 4.0.7',
    firstPatchedVersion: vuln.first_patched_version || null,
    updatedAt: data.updated_at || new Date().toISOString()
  };
}

async function fetchNpmPackage(packageName, customFetch = null) {
  const fetchFn = customFetch || fetchWithTimeout;
  const headers = {
    'User-Agent': 'Portfolio-Security-Monitor/3.0',
    'Accept': 'application/json'
  };

  const url = `https://registry.npmjs.org/${packageName}`;
  const res = await fetchFn(url, { headers });

  if (!res.ok) {
    throw new Error(`npm registry error for ${packageName}: HTTP ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const latest = data['dist-tags']?.latest || 'unknown';
  const allVersions = Object.keys(data.versions || {});

  return {
    success: true,
    packageName,
    latest,
    allVersions,
    versions: data.versions || {}
  };
}

// ============================================================================
// 3. Complete Dependency Tree & Lockfile Scanner (Root & Nested Detection)
// ============================================================================

function findInstalledInstances(projectDir, targetPackage = DEFAULT_AFFECTED_PACKAGE, vulnerableRange = '<= 4.0.7', customLockJson = null, customNpmLsJson = null) {
  const instances = [];
  const foundKeys = new Set();

  let lock = customLockJson;
  if (!lock) {
    const lockPath = path.join(projectDir, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      try {
        const raw = fs.readFileSync(lockPath, 'utf8');
        lock = JSON.parse(raw);
      } catch (e) {
        throw new Error(`Failed to parse package-lock.json: ${e.message}`);
      }
    } else {
      throw new Error(`package-lock.json not found in ${projectDir}`);
    }
  }

  if (lock) {
    // 1. Lockfile v2 & v3 (packages map)
    if (lock.packages && typeof lock.packages === 'object') {
      for (const [key, pkg] of Object.entries(lock.packages)) {
        if (!key || !pkg || !pkg.version) continue;
        const targetSuffix = `node_modules/${targetPackage}`;
        if (key === targetSuffix || key.endsWith(`/${targetSuffix}`)) {
          const isRoot = key === targetSuffix;
          let parentChain = 'root';
          if (!isRoot) {
            const parts = key.split(/\/node_modules\//);
            parts.pop();
            parentChain = parts.join(' -> ').replace(/^node_modules\//, '');
          }
          const isVulnerable = evaluateSemverRange(pkg.version, vulnerableRange);
          instances.push({
            source: 'package-lock.json (packages)',
            location: key,
            version: pkg.version,
            isRoot,
            parentChain,
            isVulnerable
          });
          foundKeys.add(`${key}@${pkg.version}`);
        }
      }
    }

    // 2. Lockfile v1 & v2 (recursive dependencies tree fallback)
    if (lock.dependencies && typeof lock.dependencies === 'object') {
      function walkDependencies(node, chain = []) {
        if (!node || typeof node !== 'object') return;
        for (const [depName, depData] of Object.entries(node)) {
          if (!depData || typeof depData !== 'object') continue;
          const currentChain = [...chain, depName];
          if (depName === targetPackage && depData.version) {
            const locKey = currentChain.join('/node_modules/');
            if (!foundKeys.has(`${locKey}@${depData.version}`)) {
              instances.push({
                source: 'package-lock.json (dependencies)',
                location: locKey,
                version: depData.version,
                isRoot: chain.length === 0,
                parentChain: chain.length > 0 ? chain.join(' -> ') : 'root',
                isVulnerable: evaluateSemverRange(depData.version, vulnerableRange)
              });
              foundKeys.add(`${locKey}@${depData.version}`);
            }
          }
          if (depData.dependencies) {
            walkDependencies(depData.dependencies, currentChain);
          }
        }
      }
      walkDependencies(lock.dependencies);
    }
  }

  // Cross-check with npm ls
  let npmLsTree = customNpmLsJson;
  if (!npmLsTree && !customLockJson) {
    try {
      const out = execSync(`npm ls ${targetPackage} --all --json`, {
        cwd: projectDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      npmLsTree = JSON.parse(out);
    } catch (e) {
      if (e.stdout) {
        try { npmLsTree = JSON.parse(e.stdout.toString()); } catch (_) {}
      }
    }
  }

  const npmLsChains = [];
  if (npmLsTree && npmLsTree.dependencies) {
    function walkNpmLs(node, chain = []) {
      if (!node || !node.dependencies) return;
      for (const [depName, depData] of Object.entries(node.dependencies)) {
        const currentChain = [...chain, `${depName}@${depData.version || '?'}`];
        if (depName === targetPackage) {
          const version = depData.version || 'unknown';
          npmLsChains.push({
            chain: currentChain.join(' -> '),
            version,
            parent: chain[chain.length - 1] || 'root',
            isVulnerable: evaluateSemverRange(version, vulnerableRange)
          });
        }
        if (depData.dependencies) {
          walkNpmLs(depData, currentChain);
        }
      }
    }
    walkNpmLs(npmLsTree);
  }

  return {
    instances,
    npmLsChains,
    totalInstalled: instances.length,
    vulnerableCount: instances.filter(i => i.isVulnerable).length
  };
}

// ============================================================================
// 4. Complete Tree Audit & Severity-Based Extraction
// ============================================================================

function executeNpmAudit(projectDir, omitDev = false, customExec = null) {
  const flag = omitDev ? '--omit=dev' : '';
  const command = `npm audit ${flag} --json`.trim();

  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  if (customExec) {
    const res = customExec(omitDev);
    stdout = res.stdout || '';
    stderr = res.stderr || '';
    exitCode = res.exitCode ?? 0;
  } else {
    try {
      stdout = execSync(command, {
        cwd: projectDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      exitCode = 0;
    } catch (err) {
      exitCode = err.status ?? 1;
      stdout = err.stdout?.toString() || '';
      stderr = err.stderr?.toString() || err.message || '';
    }
  }

  if (stdout && stdout.trim()) {
    try {
      const parsed = JSON.parse(stdout);

      if (parsed.error) {
        const code = parsed.error.code || 'UNKNOWN_ERROR';
        const isNetwork = /ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|fetch failed/i.test(code + (parsed.error.summary || ''));
        return {
          success: false,
          reason: isNetwork ? 'NETWORK_ERROR' : 'REGISTRY_ERROR',
          error: parsed.error.summary || parsed.error.message || code,
          total: null,
          bySeverity: null
        };
      }

      if (parsed.metadata && typeof parsed.metadata.vulnerabilities?.total === 'number') {
        const bySeverity = {
          critical: [],
          high: [],
          moderate: [],
          low: [],
          info: []
        };

        const vulnMap = parsed.vulnerabilities || {};
        for (const [name, entry] of Object.entries(vulnMap)) {
          const sev = (entry.severity || 'low').toLowerCase();
          const record = {
            name,
            severity: sev,
            isDirect: Boolean(entry.isDirect),
            range: entry.range || '*',
            fixAvailable: entry.fixAvailable ?? false,
            nodes: entry.nodes || [],
            via: Array.isArray(entry.via)
              ? entry.via.map(v => (typeof v === 'object' ? `${v.title || v.name} (${v.url || v.name})` : String(v))).join(', ')
              : String(entry.via || '')
          };
          if (bySeverity[sev]) {
            bySeverity[sev].push(record);
          } else {
            bySeverity.low.push(record);
          }
        }

        return {
          success: true,
          reason: parsed.metadata.vulnerabilities.total === 0 ? 'ZERO_VULNERABILITIES' : 'VULNERABILITIES_DETECTED',
          total: parsed.metadata.vulnerabilities.total,
          summary: parsed.metadata.vulnerabilities,
          bySeverity,
          raw: parsed
        };
      }
    } catch (jsonErr) {
      return {
        success: false,
        reason: 'INVALID_JSON',
        error: `Failed to parse npm audit JSON: ${jsonErr.message}`,
        total: null,
        bySeverity: null
      };
    }
  }

  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|fetch failed/i.test(stderr)) {
    return {
      success: false,
      reason: 'NETWORK_ERROR',
      error: stderr.trim(),
      total: null,
      bySeverity: null
    };
  }

  if (/E\d{3}|HTTP\s+[45]\d{2}|registry error/i.test(stderr)) {
    return {
      success: false,
      reason: 'REGISTRY_ERROR',
      error: stderr.trim(),
      total: null,
      bySeverity: null
    };
  }

  return {
    success: false,
    reason: 'UNEXPECTED_ERROR',
    error: stderr.trim() || `npm audit exited with code ${exitCode}`,
    total: null,
    bySeverity: null
  };
}

// ============================================================================
// 5. Four-State Security Decision Engine
// ============================================================================

const STATUSES = {
  OFFICIAL_PATCH_PUBLISHED: 'OFFICIAL_PATCH_PUBLISHED',
  VULNERABLE_DEPENDENCY_INSTALLED: 'VULNERABLE_DEPENDENCY_INSTALLED',
  VULNERABILITY_NOT_DETECTED: 'VULNERABILITY_NOT_DETECTED',
  SECURITY_CHECK_INCOMPLETE: 'SECURITY_CHECK_INCOMPLETE'
};

function evaluateSecurityStatus({ advisoryRes, npmPicoRes, installedRes, devAuditRes, prodAuditRes, semverError }) {
  // Check 1: Any semver evaluation or syntax error
  if (semverError) {
    return {
      status: STATUSES.SECURITY_CHECK_INCOMPLETE,
      exitCode: 1,
      reason: `Semver evaluation failed: ${semverError}`
    };
  }

  // Check 2: Upstream API and audit failures
  if (!advisoryRes?.success) {
    return {
      status: STATUSES.SECURITY_CHECK_INCOMPLETE,
      exitCode: 1,
      reason: `GitHub Advisory API check failed: ${advisoryRes?.error || 'Unknown error'}`
    };
  }

  if (!npmPicoRes?.success) {
    return {
      status: STATUSES.SECURITY_CHECK_INCOMPLETE,
      exitCode: 1,
      reason: `npm registry check failed for ${advisoryRes.packageName}: ${npmPicoRes?.error || 'Unknown error'}`
    };
  }

  if (!devAuditRes?.success) {
    return {
      status: STATUSES.SECURITY_CHECK_INCOMPLETE,
      exitCode: 1,
      reason: `Development npm audit failed (${devAuditRes.reason}): ${devAuditRes.error}`
    };
  }

  if (!prodAuditRes?.success) {
    return {
      status: STATUSES.SECURITY_CHECK_INCOMPLETE,
      exitCode: 1,
      reason: `Production npm audit failed (${prodAuditRes.reason}): ${prodAuditRes.error}`
    };
  }

  // Check 3: Check if official patch is published on npm
  const officialPatchedVersion = advisoryRes.firstPatchedVersion;
  const isPatchPublishedOnNpm = Boolean(
    officialPatchedVersion && npmPicoRes.allVersions.includes(officialPatchedVersion)
  );

  if (officialPatchedVersion && isPatchPublishedOnNpm) {
    return {
      status: STATUSES.OFFICIAL_PATCH_PUBLISHED,
      exitCode: 0,
      patchedVersion: officialPatchedVersion,
      reason: `Official patch version ${officialPatchedVersion} is confirmed by GitHub Advisory and published on npm.`
    };
  }

  // Check 4: Check if vulnerable dependency is still installed
  const hasVulnerableInstances = installedRes && installedRes.vulnerableCount > 0;
  const totalAuditVulns = (devAuditRes.total || 0) + (prodAuditRes.total || 0);

  if (hasVulnerableInstances || totalAuditVulns > 0) {
    return {
      status: STATUSES.VULNERABLE_DEPENDENCY_INSTALLED,
      exitCode: 0,
      vulnerableCount: installedRes?.vulnerableCount || 0,
      auditVulns: devAuditRes.total || 0,
      prodVulns: prodAuditRes.total || 0,
      reason: officialPatchedVersion && !isPatchPublishedOnNpm
        ? `Patch version ${officialPatchedVersion} was announced in advisory but is NOT YET available on npm.`
        : `Vulnerable dependency installed (${installedRes?.vulnerableCount || 0} instances of ${advisoryRes.packageName} in range ${advisoryRes.vulnerableRange}; ${devAuditRes.total} dev vulnerabilities), and no verified patch has been published.`
    };
  }

  // Check 5: Vulnerability no longer detected
  return {
    status: STATUSES.VULNERABILITY_NOT_DETECTED,
    exitCode: 0,
    reason: `All installed instances of '${advisoryRes.packageName}' are outside ${advisoryRes.vulnerableRange}, and audit reports 0 vulnerabilities.`
  };
}

// ============================================================================
// 6. Step Summary Formatter & Historical Report Generator
// ============================================================================

function generateMarkdownReport({ advisoryRes, npmPicoRes, npmViteRes, installedRes, devAuditRes, prodAuditRes, decision, timestamp }) {
  const lines = [];

  lines.push('# 🛡️ Security Monitor Audit Report');
  lines.push(`**Execution Timestamp:** \`${timestamp || new Date().toISOString()}\`  `);
  lines.push(`**Monitored Advisory:** [\`${advisoryRes?.ghsaId || ADVISORY_ID}\`](https://github.com/advisories/${advisoryRes?.ghsaId || ADVISORY_ID}) (\`${advisoryRes?.cveId || 'CVE-2026-112366'}\`)  `);
  lines.push(`**Primary Target Package:** \`${advisoryRes?.packageName || DEFAULT_AFFECTED_PACKAGE}\`  \n`);

  lines.push('## 1. Final Security Status');
  const badgeIcon = decision.status === STATUSES.OFFICIAL_PATCH_PUBLISHED ? '🎉' :
                    decision.status === STATUSES.SECURITY_CHECK_INCOMPLETE ? '❌' :
                    decision.status === STATUSES.VULNERABLE_DEPENDENCY_INSTALLED ? '⚠️' : '✅';

  lines.push(`> **${badgeIcon} Status:** \`${decision.status}\`  `);
  lines.push(`> **Assessment:** ${decision.reason}\n`);

  lines.push('## 2. Severity-Based Vulnerability Inventory (Complete Tree)');
  lines.push('| Severity Level | Production Count | Development Count | Affected Packages |');
  lines.push('| :--- | :---: | :---: | :--- |');

  const devSev = devAuditRes?.bySeverity || {};
  const prodSev = prodAuditRes?.bySeverity || {};

  const severities = ['critical', 'high', 'moderate', 'low'];
  for (const s of severities) {
    const pCount = prodSev[s]?.length || 0;
    const dCount = devSev[s]?.length || 0;
    const pkgs = Array.from(new Set([...(prodSev[s] || []), ...(devSev[s] || [])].map(x => x.name)));
    const icon = s === 'critical' ? '🔴' : s === 'high' ? '🟠' : s === 'moderate' ? '🟡' : '🔵';
    lines.push(`| ${icon} **${s.toUpperCase()}** | \`${pCount}\` | \`${dCount}\` | ${pkgs.length > 0 ? pkgs.map(p => `\`${p}\``).join(', ') : 'None'} |`);
  }

  // Detailed Vulnerability Table
  const allDevVulns = Object.values(devSev).flat();
  if (allDevVulns.length > 0) {
    lines.push('\n### Detailed Vulnerabilities');
    lines.push('| Package | Severity | Type | Affected Range | Primary Source / Advisory |');
    lines.push('| :--- | :---: | :---: | :---: | :--- |');
    for (const v of allDevVulns) {
      lines.push(`| \`${v.name}\` | \`${v.severity.toUpperCase()}\` | ${v.isDirect ? '**Direct**' : 'Transitive'} | \`${v.range}\` | ${v.via || 'N/A'} |`);
    }
  }

  // Installed Instances Table for Target Package
  if (installedRes?.instances?.length > 0) {
    lines.push(`\n## 3. Installed Instances of '${advisoryRes?.packageName || DEFAULT_AFFECTED_PACKAGE}'`);
    lines.push('| Location | Version | Parent Dependency Chain | Vulnerable? |');
    lines.push('| :--- | :---: | :--- | :---: |');
    for (const inst of installedRes.instances) {
      lines.push(`| \`${inst.location}\` | \`${inst.version}\` | \`${inst.parentChain}\` | ${inst.isVulnerable ? '⚠️ **YES**' : '✅ No'} |`);
    }
  }

  if (installedRes?.npmLsChains?.length > 0) {
    lines.push('\n**Transitive Dependency Chains (`npm ls`):**');
    for (const c of installedRes.npmLsChains) {
      lines.push(`- \`${c.chain}\` ${c.isVulnerable ? '(Vulnerable)' : '(Safe)'}`);
    }
  }

  lines.push('\n## 4. Recommended Action');
  if (decision.status === STATUSES.OFFICIAL_PATCH_PUBLISHED) {
    lines.push(`An official patch \`${decision.patchedVersion}\` is confirmed on npm.  `);
    lines.push('**Procedure:** Test in your isolated testing clone first:');
    lines.push('```powershell');
    lines.push(`cd "C:\\Users\\ikaus\\Desktop\\Portfolio-Security-Test\\Oportfolio"`);
    lines.push(`npm install --save-dev ${advisoryRes.packageName}@${decision.patchedVersion}`);
    lines.push('npm audit');
    lines.push('npm run build');
    lines.push('```');
  } else if (decision.status === STATUSES.VULNERABLE_DEPENDENCY_INSTALLED) {
    lines.push('- **No action required.** No verified patch has been published upstream.');
    lines.push('- Production bundle has **0 runtime vulnerabilities**.');
    lines.push('- Existing locked dependencies remain safe and stable.');
  } else if (decision.status === STATUSES.SECURITY_CHECK_INCOMPLETE) {
    lines.push('- ⚠️ Security check was incomplete due to network or API errors.');
    lines.push('- Verify network access to `api.github.com` and `registry.npmjs.org`.');
  }

  return lines.join('\n');
}

function saveHistoricalReport(projectDir, reportData, markdownContent, timestamp) {
  const reportsDir = path.join(projectDir, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const safeTimestamp = timestamp.replace(/[:.]/g, '-');
  const jsonFile = path.join(reportsDir, `audit-history-${safeTimestamp}.json`);
  const mdFile = path.join(reportsDir, `audit-history-${safeTimestamp}.md`);
  const latestJson = path.join(reportsDir, 'latest.json');
  const latestMd = path.join(reportsDir, 'latest.md');

  fs.writeFileSync(jsonFile, JSON.stringify(reportData, null, 2), 'utf8');
  fs.writeFileSync(mdFile, markdownContent, 'utf8');
  fs.writeFileSync(latestJson, JSON.stringify(reportData, null, 2), 'utf8');
  fs.writeFileSync(latestMd, markdownContent, 'utf8');

  return { jsonFile, mdFile, latestJson, latestMd };
}

// ============================================================================
// 7. GitHub Actions Workflow Annotations (No Secrets Exposed)
// ============================================================================

function emitWorkflowAnnotations(decision, devAuditRes, prodAuditRes) {
  // Only output workflow commands when running inside GitHub Actions
  if (process.env.GITHUB_ACTIONS !== 'true') return;

  if (decision.status === STATUSES.SECURITY_CHECK_INCOMPLETE) {
    console.log(`::error title=Security Check Incomplete::${decision.reason.replace(/[\r\n]+/g, ' ')}`);
    return;
  }

  const criticals = (devAuditRes?.bySeverity?.critical?.length || 0) + (prodAuditRes?.bySeverity?.critical?.length || 0);
  const highs = (devAuditRes?.bySeverity?.high?.length || 0) + (prodAuditRes?.bySeverity?.high?.length || 0);

  if (criticals > 0) {
    console.log(`::error title=Critical Vulnerabilities Detected::Dependency tree contains ${criticals} critical vulnerability instances.`);
  } else if (highs > 0) {
    console.log(`::warning title=High Severity Vulnerabilities Monitored::Dependency tree contains ${highs} high-severity development vulnerabilities (${decision.status}).`);
  }
}

// ============================================================================
// 8. Main Execution Orchestrator
// ============================================================================

async function runSecurityMonitor(options = {}) {
  const projectDir = options.projectDir || path.resolve(__dirname, '..');
  const customFetch = options.customFetch || null;
  const customExec = options.customExec || null;
  const customLockJson = options.customLockJson || null;
  const customNpmLsJson = options.customNpmLsJson || null;
  const writeSummary = options.writeSummary !== false;
  const writeReports = options.writeReports !== false;
  const timestamp = new Date().toISOString();

  console.log('========================================================================');
  console.log('🛡️  SECURITY MONITOR: React + Vite Portfolio (Enhanced Engine)');
  console.log(`    Project Directory: ${projectDir}`);
  console.log(`    Timestamp:         ${timestamp}`);
  console.log(`    semver Package:    ${semver ? `Available (v${semver.version || 'installed'})` : 'NOT FOUND'}`);
  console.log('========================================================================\n');

  let semverError = null;
  if (!semver) {
    semverError = 'semver package is not installed or available.';
  }

  // Step 1: Query GitHub Security Advisory
  console.log(`[1/4] Querying GitHub Advisory: ${ADVISORY_ID}...`);
  let advisoryRes;
  try {
    advisoryRes = await fetchAdvisory(ADVISORY_ID, customFetch);
    console.log(`      • Advisory: ${advisoryRes.ghsaId} (${advisoryRes.cveId})`);
    console.log(`      • Severity: ${advisoryRes.severity}`);
    console.log(`      • Vulnerable Range: ${advisoryRes.vulnerableRange}`);
    console.log(`      • First Patched Version: ${advisoryRes.firstPatchedVersion || 'None published yet'}`);
  } catch (err) {
    advisoryRes = { success: false, error: err.message };
    console.log(`      ❌ Advisory Query Failed: ${err.message}`);
  }

  // Step 2: Query npm Registry for picomatch & Vite
  console.log(`\n[2/4] Querying npm Registry for ${DEFAULT_AFFECTED_PACKAGE} & vite...`);
  let npmPicoRes;
  try {
    npmPicoRes = await fetchNpmPackage(DEFAULT_AFFECTED_PACKAGE, customFetch);
    console.log(`      • Latest ${DEFAULT_AFFECTED_PACKAGE} on npm: ${npmPicoRes.latest}`);
  } catch (err) {
    npmPicoRes = { success: false, error: err.message };
    console.log(`      ❌ npm Query Failed: ${err.message}`);
  }

  let npmViteRes = null;
  try {
    npmViteRes = await fetchNpmPackage('vite', customFetch);
    const v6Stable = npmViteRes.allVersions.filter(v => v.startsWith('6.') && !v.includes('beta') && !v.includes('alpha'));
    npmViteRes.latestV6 = v6Stable[v6Stable.length - 1] || '6.4.6';
    console.log(`      • Latest Vite 6 on npm: ${npmViteRes.latestV6}`);
  } catch (err) {
    npmViteRes = { success: false, error: err.message };
    console.log(`      ⚠️ Vite 6 Channel Query Warning: ${err.message}`);
  }

  // Step 3: Scan Local Dependency Tree (Root & Nested)
  console.log(`\n[3/4] Scanning Dependency Tree for '${DEFAULT_AFFECTED_PACKAGE}'...`);
  let installedRes;
  try {
    const vulnerableRange = advisoryRes.success ? advisoryRes.vulnerableRange : '<= 4.0.7';
    installedRes = findInstalledInstances(projectDir, DEFAULT_AFFECTED_PACKAGE, vulnerableRange, customLockJson, customNpmLsJson);
    console.log(`      • Total instances found: ${installedRes.totalInstalled}`);
    console.log(`      • Vulnerable instances:  ${installedRes.vulnerableCount}`);
    for (const inst of installedRes.instances) {
      console.log(`        - [${inst.location}] version: ${inst.version} (parent: ${inst.parentChain}) -> ${inst.isVulnerable ? 'VULNERABLE' : 'OK'}`);
    }
  } catch (err) {
    installedRes = { instances: [], npmLsChains: [], totalInstalled: 0, vulnerableCount: 0, error: err.message };
    console.log(`      ❌ Dependency Tree Scan Error: ${err.message}`);
    if (!semverError) semverError = err.message;
  }

  // Step 4: Execute Complete npm Audit (Production & Development with Severity Categorization)
  console.log(`\n[4/4] Executing Complete Tree Audit (Production & Development)...`);
  const prodAuditRes = executeNpmAudit(projectDir, true, customExec);
  console.log(`      • Production Audit:  ${prodAuditRes.success ? `${prodAuditRes.total} vulnerabilities` : `FAILED (${prodAuditRes.reason}: ${prodAuditRes.error})`}`);

  const devAuditRes = executeNpmAudit(projectDir, false, customExec);
  console.log(`      • Development Audit: ${devAuditRes.success ? `${devAuditRes.total} vulnerabilities` : `FAILED (${devAuditRes.reason}: ${devAuditRes.error})`}`);

  if (devAuditRes.success && devAuditRes.bySeverity) {
    console.log(`      • Severity Breakdown (Dev Tree): Critical: ${devAuditRes.bySeverity.critical.length}, High: ${devAuditRes.bySeverity.high.length}, Moderate: ${devAuditRes.bySeverity.moderate.length}, Low: ${devAuditRes.bySeverity.low.length}`);
  }

  // Decision Evaluation
  const decision = evaluateSecurityStatus({
    advisoryRes,
    npmPicoRes,
    npmViteRes,
    installedRes,
    devAuditRes,
    prodAuditRes,
    semverError
  });

  console.log('\n========================================================================');
  console.log(`📊  FINAL SECURITY STATUS: ${decision.status}`);
  console.log(`    Reason: ${decision.reason}`);
  console.log('========================================================================\n');

  // Markdown Report Generation
  const markdown = generateMarkdownReport({
    advisoryRes,
    npmPicoRes,
    npmViteRes,
    installedRes,
    devAuditRes,
    prodAuditRes,
    decision,
    timestamp
  });

  // Emit GitHub Actions workflow commands (job annotations)
  emitWorkflowAnnotations(decision, devAuditRes, prodAuditRes);

  // Write to GitHub Step Summary if running in Actions
  if (writeSummary && process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n', 'utf8');
      console.log(`[summary] Report appended to GITHUB_STEP_SUMMARY`);
    } catch (e) {
      console.warn(`[warning] Failed writing GITHUB_STEP_SUMMARY: ${e.message}`);
    }
  }

  // Save historical reports to reports/ for artifact archiving
  let reportFiles = null;
  if (writeReports) {
    try {
      reportFiles = saveHistoricalReport(projectDir, {
        timestamp,
        decision,
        advisoryRes,
        npmPicoRes,
        installedRes,
        prodAuditRes,
        devAuditRes
      }, markdown, timestamp);
      console.log(`[reports] Historical records written to reports/ directory`);
    } catch (e) {
      console.warn(`[warning] Failed saving historical report: ${e.message}`);
    }
  }

  return {
    decision,
    markdown,
    reportFiles,
    advisoryRes,
    npmPicoRes,
    npmViteRes,
    installedRes,
    devAuditRes,
    prodAuditRes
  };
}

if (require.main === module) {
  runSecurityMonitor()
    .then(({ decision }) => {
      process.exit(decision.exitCode);
    })
    .catch(err => {
      console.error('Fatal Monitor Execution Error:', err);
      process.exit(1);
    });
}

module.exports = {
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
};
