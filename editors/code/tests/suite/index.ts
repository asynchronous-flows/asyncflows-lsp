import * as path from 'path';
import * as Mocha from 'mocha';
import { glob } from 'glob';
import { exit } from 'process';
import { writeFileSync } from 'fs';

export function run(testsRoot: string, cb: (error: any, failures?: number) => void): void {
	// writeFileSync("abc.txt", "sjkfjskajfdkajsdfj");
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		timeout: 100_000,
		color: true,
		bail: true
	});

	glob('**/**.test.js', { cwd: testsRoot })
		.then((files) => {
			// Add files to the test suite
			files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

			try {
				// Run the mocha test
				mocha.run((failures) => {
					cb(null, failures);
				});
			} catch (err) {
				console.error(err);
				cb(err);
			}
		})
		.catch((err) => {
			return cb(err);
		});
}
