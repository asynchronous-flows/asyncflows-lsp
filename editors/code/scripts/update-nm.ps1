
$packageVersion = (Get-Content "node_modules\\@jinja-lsp\\functions\\package.json" | Select-String -Pattern '"version":' | Select-Object -First 1).Line -replace '.*"version": "([^"]+)".*', '$1'

$tarName = '.\\functions-' + $args[0] + '.tgz'

$packageUrl = 'https://registry.npmjs.org/@jinja-lsp/functions-' + $args[0] + '/-/functions-' + $args[0] + '-' + $packageVersion + '.tgz'

$nm = 'node_modules\\@jinja-lsp\\functions-' + $args[0]

curl $packageUrl -o $tarName

if(Test-Path $nm) {
    Remove-Item -LiteralPath $nm -Force
}

New-Item $nm -ItemType Directory -ea 0

ls

C:/Windows/system32/tar.exe -xzf $tarName 

Move-Item -Path "package\*" -Destination $nm
