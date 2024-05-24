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

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// The server is implemented in node
	// const serverModule = path.join(context.extensionPath, "bin", "asyncflows-lsp");	
	// const serverModule = context.asAbsolutePath('../../bin/asyncflows-lsp');
	const serverModule = path.join(context.extensionPath, 'out', 'bin', 'asyncflows-lsp');
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

	// Create the language client and start the client.
	client = new LanguageClient(
		'asyncflows-lsp',
		'asyncflows language server',
		serverOptions,
		clientOptions
	);

	let output = vscode.window.createOutputChannel("dbg-asyncflows-client");
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
	client.sendRequest('workspace/executeCommand', {command: 'asyncflows-lsp.vscodePythonPath', arguments: [interpreterPath]})
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

