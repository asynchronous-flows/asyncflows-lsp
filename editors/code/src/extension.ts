/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';
import { platform } from 'os';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

import * as vscode from 'vscode';
import { existsSync,  writeFileSync } from 'fs';
import {  spawnSync } from 'child_process';

// const binding = require('node-gyp-build')('node_modules/asyncflows-lsp/node_modules/@tree-sitter-grammars/tree-sitter-yaml');

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	let output = vscode.window.createOutputChannel("dbg-asyncflows-client");
	const reading = await renameTreeSitterPath(context.extensionPath, output);
	// The server is implemented in node
	// const serverModule = context.asAbsolutePath('../../bin/asyncflows-lsp');	
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
		},
	};

	// semanticTokens();

	// Create the language client and start the client.
	client = new LanguageClient(
		'asyncflows-lsp',
		'asyncflows language server',
		serverOptions,
		clientOptions
	);

	const pythonExtension = vscode.extensions.getExtension('ms-python.python');
	const jinjaExtension = vscode.extensions.getExtension('samuelcolvin.jinjahtml');
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

	if (!jinjaExtension) {
		vscode.window.showErrorMessage('Jinja extension is not installed.');
		output.appendLine('Jinja extension is not installed.')
	}


	// Start the client. This will also launch the server
	client.start();
}

async function getInterpreter(pythonExtension: vscode.Extension<any>, output: vscode.OutputChannel) {
	const pythonApi = pythonExtension.exports;
	const interpreter = await pythonApi.settings.getExecutionDetails();
	vscode.window.showInformationMessage(`Current Python Interpreter: ${interpreter?.execCommand?.join(' ') || 'Not found'}`);
	output.appendLine(`Current Python Interpreter: ${interpreter?.execCommand?.join(' ') || 'Not found'}`)
	const interpreterPath = `${interpreter?.execCommand?.join(' ')}`;
	client.sendRequest('workspace/executeCommand', { command: 'asyncflows-lsp.vscodePythonPath', arguments: [interpreterPath] })
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

export async function renameTreeSitterPath(extensionPath: string, output: vscode.OutputChannel): Promise<boolean> {
	const tempFile = path.join(extensionPath, 'renamed.txt');
	let resolving;
	const promise = new Promise<boolean>((resolve) => resolving = resolve);
	if (existsSync(tempFile)) {
		return Promise.resolve(true);
	}

	const yamlGrammar = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";
	const treeSitter = "node_modules/tree-sitter";

	const newYamlPath = path.join(extensionPath, yamlGrammar);
	const newTreeSitterPath = path.join(extensionPath, treeSitter);

	const pathLs = path.join(extensionPath, 'dist', 'languageserver.js');

	function rename() {
		const platformName = platform();
		if (platformName == 'linux' || platformName == 'darwin') {
			spawnSync('sed', ["-i''", '-e', `'s|${yamlGrammar}|${newYamlPath}|'`, pathLs]);
			spawnSync('sed', ["-i''", '-e', `'s|${treeSitter}|${newTreeSitterPath}|'`, pathLs]);
			writeFileSync(tempFile, 'true');
		}
		else if (platformName == 'win32') {
			const windowsCommand = `
    $content = Get-Content -Path "${pathLs}"; 
    $updatedContent = $content -replace "${yamlGrammar}", "${newYamlPath}"; 
    $updatedContent = $updatedContent -replace "${treeSitter}", "${newTreeSitterPath}"; 
    Set-Content -Path "${pathLs}" -Value $updatedContent
`;
			spawnSync('powershell.exe', ['-Command', windowsCommand]);
			writeFileSync(tempFile, 'true');
		}
	}

	try {
		rename();
		resolving(true);
	}

	catch (e) {
		output.appendLine('Error while updating language-server.js')
	}

	return promise;
}
