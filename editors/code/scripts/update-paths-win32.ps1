$prependContent = @"
const YAML_PATH=process.env.YAML_PATH;
const TREESITTER_PATH=process.env.TREESITTER_PATH;    
const EXT_PATH=process.env.EXT_PATH;
const PATH2=require("path");

"@
$existingContent = Get-Content -Path dist\languageserver.js -Raw
$newContent = "$prependContent`n$existingContent"
Set-Content -Path dist\languageserver.js -Value $newContent

$yamlGrammar = 'var __dirname = "node_modules\\\\@tree-sitter-grammars\\\\tree-sitter-yaml\\\\bindings\\\\node";';
$treeSitter = 'var __dirname = "node_modules\\\\tree-sitter";';

$content = Get-Content -Path dist\languageserver.js; 
$updatedContent = $content -replace $yamlGrammar, "var __dirname = YAML_PATH;"; 
$updatedContent = $updatedContent -replace $treeSitter, "var __dirname = TREESITTER_PATH;"; 
$updatedContent = $updatedContent -replace '(const __dirname = "(node_modules\\\\@jinja-lsp\\\\functions-)(.*)";)', 'const __dirname = PATH2.join(EXT_PATH, "$2$3", "functions.$3.node");\nprocess.dlopen(module, __dirname);\nreturn;\n';
Set-Content -Path "dist\languageserver.js" -Value $updatedContent
