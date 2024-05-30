/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	SemanticTokenModifiers,
	SemanticTokenTypes,
	ServerOptions,
	StaticFeature,
	TransportKind
} from 'vscode-languageclient/node';

import * as vscode from 'vscode';
import { createReadStream, createWriteStream, existsSync, readFileSync, writeFileSync } from 'fs';

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

	const oldYamlTs = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";
	const oldTs = "node_modules/tree-sitter";
	let oldYamlWritten = false;
	let oldTsWritten = false;

	const newYamlTs = path.join(extensionPath, oldYamlTs);
	const newTs = path.join(extensionPath, oldTs);

	const pathLs = path.join(extensionPath, 'dist', 'languageserver.js');

	const stream = createReadStream(pathLs, { encoding: 'utf8' });

	const bufferArray = [];


	stream.on('data', (data) => {
		if(data.includes(oldTs) && oldTsWritten == false) {
			data = (data as string).replace(oldTs, newTs);
			oldYamlWritten = true;
		}
		if(data.includes(oldYamlTs) && oldYamlWritten == false) {
			data = (data as string).replace(oldYamlTs, newYamlTs);
			oldTsWritten = false;
		}
		bufferArray.push(data);
	});

	stream.on('end', () => {
		const writeStream = createWriteStream(pathLs, {encoding: 'utf-8'});
		for (const chunk of bufferArray) {
			writeStream.write(chunk);
		}
		writeStream.close();
		writeFileSync(tempFile, 'true');
		resolving(true);
	});

	stream.on('error', (err) => {
		console.error(err);
	});
	return promise;
}

function semanticTokens() {

	const tokenTypes = new Map<string, number>();
	const tokenModifiers = new Map<string, number>();

	const tokenTypesLegend = [
		SemanticTokenTypes.class,
		SemanticTokenTypes.property,
		SemanticTokenTypes.variable
	];
	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

	const tokenModifiersLegend = [
		SemanticTokenModifiers.declaration
	];
	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

	const legend = new vscode.SemanticTokensLegend(tokenTypesLegend, tokenModifiersLegend);


	const provider: vscode.DocumentSemanticTokensProvider = {
		provideDocumentSemanticTokens(
			document: vscode.TextDocument
		): vscode.ProviderResult<vscode.SemanticTokens> {
			// analyze the document and return semantic tokens

			const tokensBuilder = new vscode.SemanticTokensBuilder(legend);
			// on line 4, characters 1-5 are a class declaration
			tokensBuilder.push(
				new vscode.Range(new vscode.Position(4, 1), new vscode.Position(4, 5)),
				'class',
				['declaration']
			);
			return tokensBuilder.build();
		}
	};

	const selector = { language: 'yaml', scheme: 'file' };
	vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);
}



