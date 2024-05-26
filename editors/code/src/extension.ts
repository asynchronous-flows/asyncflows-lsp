/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

import * as vscode from 'vscode';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// const binding = require('node-gyp-build')('node_modules/asyncflows-lsp/node_modules/@tree-sitter-grammars/tree-sitter-yaml');

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	renameTreeSitterPath(context.extensionPath);
	// The server is implemented in node
	// const serverModule = path.join(context.extensionPath, "bin", "asyncflows-lsp");	
	// const serverModule = context.asAbsolutePath('../../bin/asyncflows-lsp');
	// const serverModule = path.join(context.extensionPath, 'out', 'bin', 'asyncflows-lsp');
	// const serverModule = context.asAbsolutePath('./dist/languageserver.js');
	const serverModule = path.join(context.extensionPath, 'dist', 'languageserver.js');
	let config = {};

	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'yaml' }, { scheme: 'file', language: 'python' }],
		initializationOptions: config,
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.{py, yaml}')
		}
	};
	let output = vscode.window.createOutputChannel("dbg-asyncflows-client");

	// Create the language client and start the client.
	client = new LanguageClient(
		'asyncflows-lsp',
		'asyncflows language server',
		serverOptions,
		clientOptions
	);

	const pythonExtension = vscode.extensions.getExtension('ms-python.python');
	if (!pythonExtension) {
		vscode.window.showErrorMessage('Python extension is not installed.');
		output.appendLine('Python extension is not installed.')
		return;
	}
	if (!pythonExtension.isActive) {
		pythonExtension.activate().then(async (_value) => {
			getInterpreter(pythonExtension, output);
		});
	}
	else {
		getInterpreter(pythonExtension, output).then(() => {
		})
	}



	// Start the client. This will also launch the server
	client.start();
	output.appendLine('client started')
}

async function getInterpreter(pythonExtension: vscode.Extension<any>, output: vscode.OutputChannel) {
	const pythonApi = pythonExtension.exports;
	const interpreter = await pythonApi.settings.getExecutionDetails();
	vscode.window.showInformationMessage(`Current Python Interpreter: ${interpreter?.execCommand?.join(' ') || 'Not found'}`);
	output.appendLine(`Current Python Interpreter: ${interpreter?.execCommand?.join(' ') || 'Not found'}`)
	vscode.commands.executeCommand('asyncflows-lsp.vscodePythonPath', `${interpreter?.execCommand?.join(' ')}`).then(() => { });
	const interpreterPath = `${interpreter?.execCommand?.join(' ')}`;
	client.sendRequest('workspace/executeCommand', { command: 'asyncflows-lsp.vscodePythonPath', arguments: [interpreterPath] })
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

export function renameTreeSitterPath(extensionPath: string) {
	const tempFile = `${extensionPath}/renamed.txt`;
	if(existsSync(tempFile)) {
		return;
	}
	
	const oldYamlTs = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";
	const oldTs = "node_modules/tree-sitter";

	const newyamlTs = `${extensionPath}/${oldYamlTs}`
	const newTs = `${extensionPath}/${oldTs}`

	const pathLs = `${extensionPath}/dist/languageserver.js`;

	const content = readFileSync(pathLs);
	let newContent = content.toString().replace(oldYamlTs, newyamlTs);
	newContent = newContent.replace(oldTs, newTs);
	writeFileSync(pathLs, newContent);
	writeFileSync(tempFile, 'true');
}
