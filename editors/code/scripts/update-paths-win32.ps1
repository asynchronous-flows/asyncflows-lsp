$prependContent = @"
let YAML_PATH=process.env.YAML_PATH;
let TREESITTER_PATH=process.env.TREESITTER_PATH;    
let EXT_PATH=process.env.EXT_PATH;
let PATH2=require("path");

if(EXT_PATH == undefined) {
    const new_path = PATH2.join(__dirname, '..');
    EXT_PATH = new_path;
    let parts = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node".split("/");
    YAML_PATH = PATH2.join(new_path);
    for(const i of parts) {
        YAML_PATH = PATH2.join(YAML_PATH, i);
    }
    TREESITTER_PATH = PATH2.join(new_path, "node_modules", "tree-sitter");
}
"@
$existingContent = Get-Content -Path dist\languageserver.js -Raw
$newContent = "$prependContent`n$existingContent"
Set-Content -Path dist\languageserver.js -Value $newContent

$yamlGrammar = 'var __dirname = "node_modules\\\\@tree-sitter-grammars\\\\tree-sitter-yaml\\\\bindings\\\\node";';
$treeSitter = 'var __dirname = "node_modules\\\\tree-sitter";';

$content = Get-Content -Path dist\languageserver.js; 
$updatedContent = $content -replace $yamlGrammar, "var __dirname = YAML_PATH;"; 
$updatedContent = $updatedContent -replace $treeSitter, "var __dirname = TREESITTER_PATH;"; 
$updatedContent = $updatedContent -replace '(var __dirname = "(..\\\\..\\\\(node_modules\\\\@jinja-lsp\\\\functions-))(.*)";)', 'var __dirname = PATH2.join(EXT_PATH, "$3$4", "functions.$4.node");
process.dlopen(module, __dirname);
return;
';
Set-Content -Path "dist\languageserver.js" -Value $updatedContent

Remove-Item -Path "dist\*node"

Copy-Item -Path "..\..\node_modules\@jinja-lsp" -Destination "." -Recurse

if (-Not (Test-Path -Path "node_modules\@jinja-lsp")) {
    New-Item -Path "node_modules\@jinja-lsp" -ItemType Directory
}
Copy-Item -Path "node_modules\@jinja-lsp\*" -Destination "@jinja-lsp" -Recurse
npm uninstall asyncflows-lsp -f
if ((Test-Path -Path "node_modules\@jinja-lsp")) {
    Remove-Item -Path "node_modules\\@jinja-lsp" -Recurse -Force
}
Move-Item -Path "@jinja-lsp" -Destination "node_modules" -Force
