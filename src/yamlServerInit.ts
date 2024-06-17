import { Connection, InitializeParams, InitializeResult, TextDocumentSyncKind, SemanticTokensLegend, SemanticTokenTypes, SemanticTokenModifiers } from 'vscode-languageserver';
import {
  getLanguageService as getCustomLanguageService,
  LanguageService,
  SchemaRequestService,
  WorkspaceContextService,
} from './languageservice/yamlLanguageService';
import { workspaceFoldersChanged } from './languageservice/utils/paths';
import { URI } from 'vscode-uri';
import { SettingsState } from './yamlSettings';
import { LanguageHandlers } from './languageserver/handlers/languageHandlers';
import { NotificationHandlers } from './languageserver/handlers/notificationHandlers';
import { RequestHandlers } from './languageserver/handlers/requestHandlers';
import { ValidationHandler } from './languageserver/handlers/validationHandlers';
import { SettingsHandler } from './languageserver/handlers/settingsHandlers';
import { WorkspaceHandlers } from './languageserver/handlers/workspaceHandlers';
import { commandExecutor } from './languageserver/commandExecutor';
import { Telemetry } from './languageservice/telemetry';
import { registerCommands } from './languageservice/services/yamlCommands';
import { readPyProject } from './helper';
import * as child_process from 'child_process';
import { tokenModifiersLegend, tokenTypesLegend } from './semanticTokens';

export class YAMLServerInit {
  languageService: LanguageService;
  languageHandler: LanguageHandlers;
  validationHandler: ValidationHandler;
  settingsHandler: SettingsHandler;

  constructor(
    private readonly connection: Connection,
    private yamlSettings: SettingsState,
    private workspaceContext: WorkspaceContextService,
    private schemaRequestService: SchemaRequestService,
    private telemetry: Telemetry
  ) {

    /**
     * Run when the client connects to the server after it is activated.
     * The server receives the root path(s) of the workspace and the client capabilities.
     */
    this.connection.onInitialize((params: InitializeParams): InitializeResult => {
      return this.connectionInitialized(params);
    });
    this.connection.onInitialized(() => {
      // const result = readPyProject();      
      this.yamlSettings.asyncflowsConfig = { actions: "", configs: "**/**.yaml" };
      // if (typeof result == 'string') {
      //   console.log(`Config error is: ${result}`);
      //   this.yamlSettings.asyncflowsConfig = {actions: "", configs: "**/**.yaml"};
      // }
      // else if(typeof result == 'object') {
      //   console.log(`Config is validated`);
      //   this.yamlSettings.asyncflowsConfig = result;
      // }
      if (this.yamlSettings.hasWsChangeWatchedFileDynamicRegistration) {
        this.connection.workspace.onDidChangeWorkspaceFolders((changedFolders) => {
          this.yamlSettings.workspaceFolders = workspaceFoldersChanged(this.yamlSettings.workspaceFolders, changedFolders);
        });
      }
      // need to call this after connection initialized
      this.settingsHandler.registerHandlers();
      this.settingsHandler.pullConfiguration();
    });
  }

  // public for test setup
  connectionInitialized(params: InitializeParams): InitializeResult {
    this.yamlSettings.capabilities = params.capabilities;
    this.languageService = getCustomLanguageService({
      schemaRequestService: this.schemaRequestService,
      workspaceContext: this.workspaceContext,
      connection: this.connection,
      yamlSettings: this.yamlSettings,
      telemetry: this.telemetry,
      clientCapabilities: params.capabilities,
    });

    // Only try to parse the workspace root if its not null. Otherwise initialize will fail
    if (params.rootUri) {
      this.yamlSettings.workspaceRoot = URI.parse(params.rootUri);
    }
    this.yamlSettings.workspaceFolders = params.workspaceFolders || [];

    this.yamlSettings.hierarchicalDocumentSymbolSupport = !!(
      this.yamlSettings.capabilities.textDocument &&
      this.yamlSettings.capabilities.textDocument.documentSymbol &&
      this.yamlSettings.capabilities.textDocument.documentSymbol.hierarchicalDocumentSymbolSupport
    );
    this.yamlSettings.clientDynamicRegisterSupport = !!(
      this.yamlSettings.capabilities.textDocument &&
      this.yamlSettings.capabilities.textDocument.rangeFormatting &&
      this.yamlSettings.capabilities.textDocument.rangeFormatting.dynamicRegistration
    );
    this.yamlSettings.hasWorkspaceFolderCapability =
      this.yamlSettings.capabilities.workspace && !!this.yamlSettings.capabilities.workspace.workspaceFolders;

    this.yamlSettings.hasConfigurationCapability = !!(
      this.yamlSettings.capabilities.workspace && !!this.yamlSettings.capabilities.workspace.configuration
    );

    this.yamlSettings.hasWsChangeWatchedFileDynamicRegistration = !!(
      this.yamlSettings.capabilities.workspace &&
      this.yamlSettings.capabilities.workspace.didChangeWatchedFiles &&
      this.yamlSettings.capabilities.workspace.didChangeWatchedFiles.dynamicRegistration
    );
    this.registerHandlers();
    registerCommands(commandExecutor, this.connection);

    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: { resolveProvider: false,triggerCharacters: ["", " "],allCommitCharacters: [""] },
        hoverProvider: true,
        documentSymbolProvider: true,
        documentFormattingProvider: false,
        documentOnTypeFormattingProvider: {
          firstTriggerCharacter: '\n',
          moreTriggerCharacter: [":", " "]
        },
        documentRangeFormattingProvider: false,
        definitionProvider: true,
        declarationProvider: true,
        documentLinkProvider: {},
        foldingRangeProvider: true,
        selectionRangeProvider: true,
        codeActionProvider: true,
        codeLensProvider: {
          resolveProvider: false,
        },
        executeCommandProvider: {
          commands: ["asyncflows-lsp.vscodePythonPath"]
        },
        workspace: {
          workspaceFolders: {
            changeNotifications: true,
            supported: true,
          },
        },
        semanticTokensProvider: {
          full: true,
          legend: {
            tokenTypes: tokenTypesLegend,
            tokenModifiers: tokenModifiersLegend,
          },
        }
      },
    };
  }

  private registerHandlers(): void {
    // Register all features that the language server has
    this.validationHandler = new ValidationHandler(this.connection, this.languageService, this.yamlSettings);
    this.settingsHandler = new SettingsHandler(
      this.connection,
      this.languageService,
      this.yamlSettings,
      this.validationHandler,
      this.telemetry,
    );
    // this.settingsHandler.registerHandlers();
    this.languageHandler = new LanguageHandlers(this.connection, this.languageService, this.yamlSettings, this.validationHandler);
    this.languageHandler.registerHandlers();
    new NotificationHandlers(this.connection, this.languageService, this.yamlSettings, this.settingsHandler).registerHandlers();
    new RequestHandlers(this.connection, this.languageService).registerHandlers();
    new WorkspaceHandlers(this.connection, commandExecutor, this.languageService).registerHandlers();
  }

  start(): void {
    this.connection.listen();
  }
}
