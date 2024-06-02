<img src="https://raw.githubusercontent.com/asynchronous-flows/asyncflows-lsp/main/banner.png" alt="banner" />

<div align="center">
Language Server for asyncflows
</div>

# Installation

To associate an asyncflows YAML file with the language server, place this snippet at the top of the file:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/asynchronous-flows/asyncflows/main/schemas/asyncflows_schema.json
```

Then, follow the instructions for your editor.
If your editor is not specified here, but you would like to use the language server, please open an issue.

### VSCode

1. Download `vsix` file from [here](https://marketplace.visualstudio.com/items?itemName=AsynchronousFlows.asyncflows-lsp).
2. Navigate to the `Extensions` view
3. Click on the `...` menu
4. Select `Install from VSIX...`
5. Select the downloaded `vsix` file
6. Reload the window

### NeoVim

```lua
local nvim_lsp = require('lspconfig')
local configs = require('lspconfig.configs')

if not configs.asyncflows_lsp then
configs.asyncflows_lsp = {
  default_config = {
    name = "asyncflows-lsp",
    cmd = { 'asyncflows-lsp --stdio' },
    filetypes = { 'yaml' },
    root_dir = function(fname)
      return "."
    end,
},
}
end
local capabilities = require('cmp_nvim_lsp').default_capabilities(vim.lsp.protocol.make_client_capabilities())
nvim_lsp.asyncflows_lsp.setup {
  capabilities = capabilities
}
nvim_lsp.asyncflows_lsp.setup {
}
```

### Helix

```toml
[language-server.asyncflows-lsp]
command = "asyncflows-lsp"
args = ["--stdio"]


[[language]]
name = "yaml"
language-servers = ["asyncflows-lsp", "yaml-lsp"]
```

# Development

## VSCode

```sh
git clone https://github.com/asynchronous-flows/asyncflows-lsp --depth 1
cd asyncflows-lsp
make build
code editors/code
```

## Other editors

```sh
npm install -g asyncflows-lsp
```

