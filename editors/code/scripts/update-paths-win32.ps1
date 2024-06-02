$prependContent = @"
const YAML_PATH=process.env.YAML_PATH;
const TREESITTER_PATH=process.env.TREESITTER_PATH;    
"@
$existingContent = Get-Content -Path dist\languageserver.js -Raw
$newContent = "$prependContent`n$existingContent"
Set-Content -Path dist\languageserver.js -Value $newContent

$yamlGrammar = 'var __dirname = "node_modules\\\\@tree-sitter-grammars\\\\tree-sitter-yaml\\\\bindings\\\\node";';
$treeSitter = 'var __dirname = "node_modules\\\\tree-sitter";';

$content = Get-Content -Path dist\languageserver.js; 
$updatedContent = $content -replace $yamlGrammar, "var __dirname = YAML_PATH;"; 
$updatedContent = $updatedContent -replace $treeSitter, "var __dirname = TREESITTER_PATH;"; 
Set-Content -Path "dist\languageserver.js" -Value $updatedContent
