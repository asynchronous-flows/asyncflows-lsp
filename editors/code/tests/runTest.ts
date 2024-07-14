import * as path from 'path';
import * as cp from 'child_process';
import { runTests, downloadAndUnzipVSCode, resolveCliArgsFromVSCodeExecutablePath, runVSCodeCommand } from '@vscode/test-electron';


async function go() {
  console.log(__dirname);
  // return ;
	const extensionDevelopmentPath = path.resolve(__dirname, '..', '..');
	const extensionTestsPath = path.resolve(extensionDevelopmentPath, 'out', 'test', 'suite');

	const testWorkspace = path.resolve(extensionDevelopmentPath, 'example');
	/**
	 * Basic usage
	 * Running another test suite on a specific workspace
	*/

	await runVSCodeCommand(['--install-extension', 'ms-python.python']);
	await runVSCodeCommand(['--install-extension', 'samuelcolvin.jinjahtml']);

	let tests = await runTests({
		version: '1.91.0',
		extensionDevelopmentPath,
		extensionTestsPath,
		launchArgs: [testWorkspace]
	});
}

go();
