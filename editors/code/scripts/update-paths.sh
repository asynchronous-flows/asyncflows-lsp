
ls
sed -i'' '1s|^|let YAML_PATH=process.env.YAML_PATH;\nlet TREESITTER_PATH=process.env.TREESITTER_PATH;\nlet EXT_PATH=process.env.EXT_PATH;\nlet PATH2=require("path");\n if(EXT_PATH == undefined) {\n let new_path = PATH2.join(__dirname, "..");\nEXT_PATH = new_path;\nlet parts = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node".split("/");\n YAML_PATH = PATH2.join(new_path);\n for(let i of parts)\n{\n\nYAML_PATH = PATH2.join(YAML_PATH, i);\n}\nTREESITTER_PATH = PATH2.join(new_path, "node_modules", "tree-sitter");\n}\n|' dist/languageserver.js
sed -i'' 's|var __dirname = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";|var __dirname = YAML_PATH;|' dist/languageserver.js
sed -i'' 's|var __dirname = "node_modules/tree-sitter";|var __dirname = TREESITTER_PATH;|' dist/languageserver.js
sed -i'' -E 's|(var __dirname = "(node_modules/@jinja-lsp/functions-)(.*)";)|var __dirname = PATH2.join(EXT_PATH, "\2\3", "functions.\3.node");\nprocess.dlopen(module, __dirname);\nreturn;|' dist/languageserver.js
rm -rf dist/*node
