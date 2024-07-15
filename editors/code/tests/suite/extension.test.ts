import * as path from 'path';

import * as assert from 'assert';

import * as vscode from 'vscode'


suite('Extension Test Suite 1', () => {
  test('Sample test', async () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));

    console.log(`dir: ${__dirname}`)

    let debonoYaml = path.join(__dirname, '..', '..', '..', 'example', 'configs', 'debono.yaml')
    debonoYaml = decodeURIComponent(debonoYaml);
    const debonoYamlUri = vscode.Uri.parse(debonoYaml);

    const doc = await vscode.workspace.openTextDocument(debonoYamlUri);
    (await vscode.window.showTextDocument(doc)).edit((edit) => {
      let lastLine = doc.lineCount;
      let position = new vscode.Position(lastLine - 1, 0);
      edit.insert(position, "\n");
    });

    const [ext, pythonExt, interval] = await getExtensions();
    clearInterval(interval);

    let returnedSchema = false;
    if (ext) {
      if (ext.exports) {
        // await vscode.commands.executeCommand('workbench.action.closeActiveEditor')      
        const settings = ext.exports.settings;
        settings.enableLogs();
        settings.pingServer();
        settings.addFn((msg: any) => {
          if (typeof msg == "object") {
            const t = msg.t;
            console.log(`t: ${t}`)
            if (t == "vscodePing") {
              assert.strictEqual(msg.message, "pong");
              doc.save().then(() => { });
            }
            else if (t == "onSave") {
              const content = msg.message as string;
              // console.log(content);
              assert.strictEqual(content.includes('__LinkHintLiteral'), true);
              returnedSchema = true;
              // vscode.commands.executeCommand('workbench.action.closeWindow').then(()=>{});
            }
          }
        })
      }
    }
    await wait(20000);
    assert.strictEqual(returnedSchema, true);
    // await vscode.commands.executeCommand('workbench.action.closeWindow');
  });
});



function wait(ms: number) {
  let p = new Promise((res, rej) => {
    setTimeout(() => {
      res(true);
    }, ms)
  });
  return p
}

async function getExtensions(): Promise<[vscode.Extension<any>, vscode.Extension<any>, number]> {
  return new Promise((res, rej) => {
    let i = setInterval(() => {
      try {
        const pythonExt = vscode.extensions.getExtension('ms-python.python');
        const ext = vscode.extensions.getExtension('AsynchronousFlows.asyncflows-lsp');
        let interval = (i as unknown) as number;
        if(!ext) {
          return;
        }
        if(!ext.exports) {
          return;
        }
        if(!pythonExt) {
          return;
        }
        res([ext, pythonExt, interval])
        clearInterval(interval);
      }
      catch (e) {
      }
    }, 500);
    });

}
