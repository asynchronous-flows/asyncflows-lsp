$prependContent = @"
const YAML_PATH=process.env.YAML_PATH;
const TREESITTER_PATH=process.env.TREESITTER_PATH;    
"@
$existingContent = Get-Content -Path dist\languageserver.js -Raw
$newContent = "$prependContent`n$existingContent"
Set-Content -Path dist\languageserver.js -Value $newContent

$content = Get-Content -Path 'dist\languageserver.js'; 
$updatedContent = $content -replace 'var __dirname = "node_modules/@tree-sitter-grammars/tree-sitter-yaml/bindings/node";', "var __dirname = YAML_PATH;"; 
$updatedContent = $updatedContent -replace 'var __dirname = "node_modules/tree-sitter";', "var __dirname = TREESITTER_PATH;"; 
Set-Content -Path "dist\languageserver.js" -Value $updatedContent
