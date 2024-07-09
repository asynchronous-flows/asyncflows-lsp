import * as cp from 'child_process';
import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
  runTests
} from '@vscode/test-electron';

import * as assert from 'assert';

import * as vscode from 'vscode'

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../..');
    console.log(extensionDevelopmentPath);
    const extensionTestsPath = path.resolve(__dirname, './out/test');
    const vscodeExecutablePath = await downloadAndUnzipVSCode('insiders');
    const [cliPath, ...args] = resolveCliArgsFromVSCodeExecutablePath(vscodeExecutablePath);

    // Use cp.spawn / cp.exec for custom setup
    const result = cp.spawnSync(
      cliPath,
      ['--install-extension', 'asyncflows-lsp-0.1.13.vsix'],
      {
        encoding: 'utf-8',
        stdio: 'inherit'
      }
    );

    // Run the extension test
    await runTests({
      // Use the specified `code` executable
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath
    });


  } catch (err) {
    console.log('error in main')
    console.error('Failed to run tests');
    process.exit(1);
  }
}

// main();

test('Sample test', async () => {
  assert.strictEqual(-1, [1, 2, 3].indexOf(5));
  assert.strictEqual(-1, [1, 2, 3].indexOf(0));

  const debonoYaml = path.join(__dirname, '..', '..', 'example', 'configs', 'debono.yaml')
  const debonoYamlUri = vscode.Uri.parse(debonoYaml);

  const doc = await vscode.workspace.openTextDocument(debonoYamlUri);
  const ext = vscode.extensions.getExtension('AsynchronousFlows.asyncflows-lsp');

  function wait(ms: number) {
    let p = new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, ms)
    });
    return p
  }
  await wait(2000);

  if (ext) {
    if (ext.exports) {
      await vscode.commands.executeCommand('workbench.action.closeActiveEditor')      
      const settings = ext.exports.settings;
      settings.pingServer();
      settings.addFn((msg: any) => {
        if(typeof msg == "object") {
          const t = msg.t;
          assert.strictEqual(t, "vscodePing");
        }
      })
    }
  }
  await wait(3000);

  const doc2 = await vscode.workspace.openTextDocument(debonoYamlUri);
  await wait(2000);
});
