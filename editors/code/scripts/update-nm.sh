
pkgversion=$(grep '"version":' node_modules/@jinja-lsp/functions/package.json | awk -F: '{gsub(/[", ]/, "", $2); print $2}' | head -n 1)
wget "https://registry.npmjs.org/@jinja-lsp/functions-${1}/-/functions-${1}-${pkgversion}.tgz"
rm -rf "node_modules/@jinja-lsp/functions-${1}"
mkdir "node_modules/@jinja-lsp/functions-${1}"
tar -xzf "functions-${1}-${pkgversion}.tgz" 
mv package/* "node_modules/@jinja-lsp/functions-${1}"
