const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const urls = [
  'http://localhost:3000',
  'http://localhost:3000/themes',
  'http://localhost:3000/themes/economy'
];

const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
  },
};

async function runLighthouse(url, config) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    port: chrome.port,
  };

  try {
    const results = await lighthouse(url, options, config);
    const reportHtml = results.report;
    const reportPath = path.join(__dirname, '../reports', `${url.split('/').pop() || 'home'}-report.html`);
    
    fs.writeFileSync(reportPath, reportHtml);
    
    const scores = {
      performance: results.lhr.categories.performance.score * 100,
      accessibility: results.lhr.categories.accessibility.score * 100,
      'best-practices': results.lhr.categories['best-practices'].score * 100,
      seo: results.lhr.categories.seo.score * 100,
    };

    console.log(`\nScores for ${url}:`);
    console.log('-------------------');
    Object.entries(scores).forEach(([category, score]) => {
      console.log(`${category}: ${score.toFixed(1)}`);
    });

    return scores;
  } finally {
    await chrome.kill();
  }
}

async function runAudits() {
  console.log('Starting Lighthouse audits...');
  
  const results = {};
  
  for (const url of urls) {
    console.log(`\nAuditing ${url}...`);
    results[url] = await runLighthouse(url, config);
  }

  // Vérifier si tous les scores sont > 90
  const allScoresAbove90 = Object.values(results).every(scores => 
    Object.values(scores).every(score => score >= 90)
  );

  console.log('\nAudit Summary:');
  console.log('--------------');
  console.log(`All scores above 90: ${allScoresAbove90 ? '✅' : '❌'}`);
  
  if (!allScoresAbove90) {
    console.log('\nPages needing improvement:');
    Object.entries(results).forEach(([url, scores]) => {
      const lowScores = Object.entries(scores)
        .filter(([_, score]) => score < 90)
        .map(([category, score]) => `${category}: ${score.toFixed(1)}`);
      
      if (lowScores.length > 0) {
        console.log(`\n${url}:`);
        lowScores.forEach(score => console.log(`  - ${score}`));
      }
    });
  }
}

runAudits().catch(console.error); 