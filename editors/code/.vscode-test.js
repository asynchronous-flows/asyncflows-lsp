// .vscode-test.js
const { defineConfig } = require('@vscode/test-cli');

module.exports = defineConfig([
  {
    label: 'integrationTests',
    files: 'out/test/**/*.test.js',
    version: 'insiders',
    workspaceFolder: './sampleWorkspace',
    mocha: {
      ui: 'tdd',
      timeout: 20000
    }
  }
  // you can specify additional test configurations, too
]);
