build:
	npm install
	npm run build2
	cd editors/code && npm install && npm run compile3 && npm run package

package:
	cd editors/code && npm run compile3 && npm run package
