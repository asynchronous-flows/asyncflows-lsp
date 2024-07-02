
ls
sed -i'' '1s|^|const YAML_PATH=process.env.YAML_PATH;\nconst TREESITTER_PATH=process.env.TREESITTER_PATH;\nconst EXT_PATH=process.env.EXT_PATH;\nconst PATH2=require("path");\n|' dist/languageserver.js
sed -i'' 's|var __dirname = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";|var __dirname = YAML_PATH;|' dist/languageserver.js
sed -i'' 's|var __dirname = "node_modules/tree-sitter";|var __dirname = TREESITTER_PATH;|' dist/languageserver.js
sed -i'' -E 's|(var __dirname = "(node_modules/@jinja-lsp/functions-)(.*)";)|var __dirname = PATH2.join(EXT_PATH, "\2\3", "functions.\3.node");\nprocess.dlopen(module, __dirname);\nreturn;|' dist/languageserver.js
rm -rf dist/*node
