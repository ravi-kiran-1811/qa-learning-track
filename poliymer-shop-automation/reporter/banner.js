// Custom banner reporter — plain JS to avoid @playwright/test double-require issue.

const LINE = '═'.repeat(62);
const THIN = '─'.repeat(62);

class BannerReporter {
  onTestBegin(test) {
    console.log(`\n${LINE}`);
    console.log(`  ▶  STARTING TEST`);
    console.log(`  📋 ${test.title}`);
    console.log(THIN);
    console.log(`  🌐 Launching browser and opening page...`);
    console.log(THIN);
  }

  onTestEnd(test, result) {
    const duration = (result.duration / 1000).toFixed(1);
    if (result.status === 'passed') {
      console.log(THIN);
      console.log(`  ✅  TEST PASSED  —  ${duration}s`);
    } else if (result.status === 'skipped') {
      console.log(THIN);
      console.log(`  ⏭   TEST SKIPPED  —  ${duration}s`);
    } else {
      const msg = (result.errors[0]?.message ?? 'Unknown error').split('\n')[0];
      console.log(THIN);
      console.log(`  ❌  TEST FAILED  —  ${duration}s`);
      console.log(`  💥  ${msg}`);
    }
    console.log(LINE);
    console.log(`  ⏸   Waiting before next test...`);
    console.log(`${LINE}\n`);
  }

  onEnd(result) {
    const icon = result.status === 'passed' ? '✅' : '❌';
    console.log(`\n${LINE}`);
    console.log(`  ${icon}  ALL TESTS ${result.status.toUpperCase()}`);
    console.log(`${LINE}\n`);
  }
}

module.exports = BannerReporter;
