<img src="https://github.com/asynchronous-flows/asyncflows-lsp/blob/semantic-highlighting/banner.png" alt="banner" />

<div align="center">
Language Server for asyncflows
</div>

## Installation

Download `vsix` file from [here](https://github.com/asynchronous-flows/asyncflows-lsp/releases).

To activate language server place this snippet at the top of your yaml:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/asynchronous-flows/asyncflows/main/schemas/asyncflows_schema.json
```

## VSCode Development

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
