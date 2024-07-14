# Define the directory to search in
$searchDir = ".vscode-test"

# Search for files containing 'abc123' in their name
$files = Get-ChildItem -Path $searchDir -Recurse -Filter "*asyncflows language*"

# Check if any files are found
if ($files) {
    foreach ($file in $files) {
        $dirPath = $file.DirectoryName
        Write-Output "File directory found at: $dirPath"
        Get-Content "$dirPath\\4-asyncflows language server.log"
    }
}  else {
    Write-Output "No files containing 'asyncflows language' found in '$searchDir'."
}
