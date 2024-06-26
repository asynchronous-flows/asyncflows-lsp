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

// const binding = require('node-gyp-build')('node_modules/asyncflows-lsp/node_modules/@tree-sitter-grammars/tree-sitter-yaml');

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
	let output = vscode.window.createOutputChannel("dbg-asyncflows-client");
	// The server is implemented in node
	// const serverModule = context.asAbsolutePath('../../bin/asyncflows-lsp');
	const serverModule = path.join(context.extensionPath, 'dist', 'languageserver.js');
	let config = {};
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
	const tsPath = tsPaths(context.extensionPath);

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc, options: { env: { 'YAML_PATH': tsPath[0], 'TREESITTER_PATH': tsPath[1], 'EXT_PATH': context.extensionPath } } },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'yaml' }],
		initializationOptions: config,
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.yaml')
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
			await getInterpreter(pythonExtension);
		});
	}
	else {
		await getInterpreter(pythonExtension);
	}

	if (!jinjaExtension) {
		vscode.window.showErrorMessage('Jinja extension is not installed.');
		output.appendLine('Jinja extension is not installed.')
	}


	// Start the client. This will also launch the server
	client.start();
}

async function getInterpreter(pythonExtension: vscode.Extension<any>) {
	const pythonApi = pythonExtension.exports;
	const interpreter = await pythonApi.settings.getExecutionDetails();
	if (interpreter == undefined) {
		vscode.window.showErrorMessage(`Python interpreter is not configured.`)
	}
	if (interpreter) {
		if (!interpreter.execCommand) {
			vscode.window.showErrorMessage(`Python interpreter is not configured.`)
		}
		else {
			vscode.window.showInformationMessage(`Current Python Interpreter: ${interpreter.execCommand.join(' ')}`);
			const interpreterPath = `${interpreter.execCommand.join(' ')}`;
			client.sendRequest('workspace/executeCommand', { command: 'asyncflows-lsp.vscodePythonPath', arguments: [interpreterPath] })
		}
	}
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function tsPaths(extensionPath: string): [string, string] {

	const yamlGrammar = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";
	const treeSitter = "node_modules/tree-sitter";

	const newYamlPath = path.join(extensionPath, yamlGrammar);
	const newTreeSitterPath = path.join(extensionPath, treeSitter);

	return [newYamlPath, newTreeSitterPath]

}
