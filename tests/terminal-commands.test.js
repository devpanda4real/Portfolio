/**
 * Automated Test: Terminal Commands & migration-news Removal Verification
 */

import assert from 'assert';
import { terminalCommonCommands } from '../src/data/terminalData.js';

console.log('========================================================================');
console.log('🧪 RUNNING TERMINAL COMMANDS & MIGRATION-NEWS VERIFICATION');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

// 1. Help text verification
test('1: Help command output does not reference migration-news', () => {
  assert.ok(terminalCommonCommands.help, 'Help command must exist');
  assert.strictEqual(
    terminalCommonCommands.help.includes('migration-news'),
    false,
    'Help text must not include migration-news'
  );
});

// 2. Available commands in help
test('2: Standard commands remain present in help text', () => {
  const help = terminalCommonCommands.help;
  assert.ok(help.includes('about'));
  assert.ok(help.includes('skills'));
  assert.ok(help.includes('projects'));
  assert.ok(help.includes('education'));
  assert.ok(help.includes('contact'));
  assert.ok(help.includes('whoami'));
  assert.ok(help.includes('neofetch'));
  assert.ok(help.includes('clear'));
});

// 3. Command definitions intact
test('3: Core command text outputs are defined and intact', () => {
  assert.ok(terminalCommonCommands.about.includes('Imesh Kaushalya'));
  assert.ok(terminalCommonCommands.skills.includes('AWS Cloud'));
  assert.ok(terminalCommonCommands.education.includes('SLTC'));
  assert.ok(terminalCommonCommands.projects.includes('Luxora'));
});

console.log('\n========================================================================');
console.log(`📊 TEST SUITE SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================\n');

if (failed > 0) {
  process.exit(1);
}
