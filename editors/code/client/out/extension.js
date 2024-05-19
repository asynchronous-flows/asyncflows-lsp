"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const child_process = require("child_process");
let client;
function activate(context) {
    // The server is implemented in node
    const serverModule = context.asAbsolutePath('../../bin/yaml-language-server');
    // const serverModule = getServer();
    // if (!serverModule.valid) {
    // 	throw new Error(serverModule.name);
    // }
    // let config: Record<string, any> = JSON.parse(
    // 	JSON.stringify(workspace.getConfiguration("asyncflows-lsp"))
    // );
    let config = {};
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverModule, transport: node_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: node_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Options to control the language client
    const clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'yaml' }, { scheme: 'file', language: 'python' }],
        initializationOptions: config,
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.{py, yaml}')
        }
    };
    // Create the language client and start the client.
    client = new node_1.LanguageClient('asyncflows-lsp', 'asyncflows language server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
function getServer() {
    try {
        // let name = "YOUR_PATH_TO_LSP";
        let name = "/home/uros/Documents/programiranje/python/asyncflows/asyncflows-lsp/bin/yaml-language-server --stdio";
        // let name = "asyncflows-lsp";
        const validation = child_process.spawnSync(name);
        if (validation.status === 0) {
            return { valid: true, name: name };
        }
        else {
            return { valid: false, name: "asyncflows language server not installed." };
        }
    }
    catch (e) {
        return { valid: false, name: "asyncflows language server not installed." };
    }
}
//# sourceMappingURL=extension.js.map