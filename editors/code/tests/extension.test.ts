import * as cp from 'child_process';
import * as path from 'path';
import {
  downloadAndUnzipVSCode,
  resolveCliArgsFromVSCodeExecutablePath,
  runTests
} from '@vscode/test-electron';

import * as assert from 'assert';

import * as vscode from 'vscode'


test('Sample test', async () => {
  assert.strictEqual(-1, [1, 2, 3].indexOf(5));
  assert.strictEqual(-1, [1, 2, 3].indexOf(0));

  const debonoYaml = path.join(__dirname, '..', '..', 'example', 'configs', 'debono.yaml')
  const debonoYamlUri = vscode.Uri.parse(debonoYaml);

  const doc = await vscode.workspace.openTextDocument(debonoYamlUri);
  (await vscode.window.showTextDocument(doc)).edit((edit) => {
    let lastLine = doc.lineCount;
    let position = new vscode.Position(lastLine - 1, 0);
    edit.insert(position, "\n");
  });
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

  let returnedSchema = false;
  if (ext) {
    if (ext.exports) {
      // await vscode.commands.executeCommand('workbench.action.closeActiveEditor')      
      const settings = ext.exports.settings;
      settings.pingServer();
      settings.enableLogs();
      settings.addFn((msg: any) => {
        if(typeof msg == "object") {
          const t = msg.t;
          console.log(`t: ${t}`)
          if(t == "vscodePing") {
            assert.strictEqual(msg.message, "pong");
            doc.save().then(() => {});
          }
          else if(t == "onSave") {
            const content = msg.message as string;
            assert.strictEqual(content.includes('__LinkHintLiteral'), true);
            returnedSchema = true;
          }
        }
      })
    }
  }
  await wait(5000);
  assert.strictEqual(returnedSchema, true);

});
