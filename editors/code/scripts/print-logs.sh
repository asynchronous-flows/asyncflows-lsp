
file_path=$(find ".vscode-test" -type f -name "*asyncflows language*")
dir_path=$(dirname "$file_path")
cat "$dir_path/4-asyncflows language server.log" 

file_path=$(find ".vscode-test" -type f -name "*dbg-asyncflows-client*")
dir_path=$(dirname "$file_path")
cat "$dir_path/3-dbg-asyncflows-client.log"
