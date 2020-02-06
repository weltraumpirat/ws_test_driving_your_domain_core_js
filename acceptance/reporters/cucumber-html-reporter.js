/* eslint-disable */
const reporter = require('cucumber-html-reporter');
const options = {
  // theme: 'bootstrap', hierarchy
  theme: 'hierarchy',
  jsonFile: 'acceptance/reports/cucumber-report.json',
  output: 'acceptance/reports/cucumber-report.html',
  reportSuiteAsScenarios: true,
  launchReport: true,
  metadata: {
    "App Version": "1.0.0",
    "Test Environment": "LOCAL",
  }
};

reporter.generate(options);

process.exit(0);