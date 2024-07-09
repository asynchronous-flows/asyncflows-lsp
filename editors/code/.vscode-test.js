// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'integrationTests',
    files: 'out/test/**/*.test.js',
    version: '1.82.0',
    workspaceFolder: './example',
    mocha: {
      ui: 'tdd',
      // delay: 300,
      timeout: 50000
    }
  }
  // you can specify additional test configurations, too
]);
