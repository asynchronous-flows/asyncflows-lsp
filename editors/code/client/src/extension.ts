/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, commands, window, Range, Selection } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import * as child_process from 'child_process';
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

	const result = child_process.spawnSync("python", ["-c", "import sys; print(sys.prefix)"])
	const result2 = child_process.spawnSync("pip", ["show", "pip"])
  console.log(result.stdout.toString())
  console.log(result2.stdout.toString())
	
	const pythonExtension = vscode.extensions.getExtension('ms-python.python');
	if (!pythonExtension) {
		vscode.window.showErrorMessage('Python extension is not installed.');
		return;
	}
	if (!pythonExtension.isActive) {
		pythonExtension.activate().then(async(value) => {
			const pythonApi = pythonExtension.exports;
			const interpreter = await pythonApi.settings.getExecutionDetails();
			vscode.window.showInformationMessage(`Current Python Interpreter: ${interpreter?.execCommand?.join(' ') || 'Not found'}`);
		});
	}

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

