<img src="https://raw.githubusercontent.com/asynchronous-flows/asyncflows-lsp/main/banner.png" alt="banner" />

<div align="center">
Language Server for asyncflows
</div>

## Configuration

To associate an asyncflows YAML file with the language server, place this snippet at the top of the file:

```yaml
# asyncflows-language-server
```

If you specificed schema like this:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/asynchronous-flows/asyncflows/main/schemas/asyncflows_schema.json
```

It will be automatically updated to the first one. 

Then, follow the instructions for your editor.
If your editor is not specified here, but you would like to use the language server, please open an issue.

## Installation

You can find the extension [on the VSCode marketplace](https://marketplace.visualstudio.com/items?itemName=AsynchronousFlows.asyncflows-lsp).

Alternatively, install it manually:

1. Download `vsix` file from [here](https://marketplace.visualstudio.com/items?itemName=AsynchronousFlows.asyncflows-lsp).
2. Navigate to the `Extensions` view
3. Click on the `...` menu
4. Select `Install from VSIX...`
5. Select the downloaded `vsix` file
6. Reload the window

### Development

```sh
git clone https://github.com/asynchronous-flows/asyncflows-lsp --depth 1
cd asyncflows-lsp
make build
code editors/code
```
