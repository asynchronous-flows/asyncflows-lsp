/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Connection, TextDocument, TextDocumentChangeEvent } from 'vscode-languageserver';
import {
  CodeActionParams,
  DidChangeWatchedFilesParams,
  DocumentFormattingParams,
  DocumentLinkParams,
  DocumentOnTypeFormattingParams,
  DocumentSymbolParams,
  FoldingRangeParams,
  SelectionRangeParams,
  TextDocumentPositionParams,
  CodeLensParams,
  DefinitionParams,
  DeclarationParams,
  DeclarationLink,
  SemanticTokensRequest,
} from 'vscode-languageserver-protocol';
import {
  CodeAction,
  CodeLens,
  CompletionList,
  DefinitionLink,
  DocumentLink,
  DocumentSymbol,
  Hover,
  FoldingRange,
  SelectionRange,
  SymbolInformation,
  TextEdit,
} from 'vscode-languageserver-types';
import { isKubernetesAssociatedDocument } from '../../languageservice/parser/isKubernetes';
import { LanguageService } from '../../languageservice/yamlLanguageService';
import { SettingsState } from '../../yamlSettings';
import { ValidationHandler } from './validationHandlers';
import { ResultLimitReachedNotification } from '../../requestTypes';
import * as path from 'path';
import { read2 } from '../../helper';
import { SyntaxNode } from 'tree-sitter';
import { get_state } from '../../tree_sitter_queries/queries';

export class LanguageHandlers {
  private languageService: LanguageService;
  private yamlSettings: SettingsState;
  private validationHandler: ValidationHandler;
  private fetchCallback: NodeJS.Timeout

  pendingLimitExceededWarnings: { [uri: string]: { features: { [name: string]: string }; timeout?: NodeJS.Timeout } };

  constructor(
    private readonly connection: Connection,
    languageService: LanguageService,
    yamlSettings: SettingsState,
    validationHandler: ValidationHandler
  ) {
    this.languageService = languageService;
    this.yamlSettings = yamlSettings;
    this.validationHandler = validationHandler;
    this.pendingLimitExceededWarnings = {};
  }

  public registerHandlers(): void {
    this.connection.onDocumentLinks((params) => this.documentLinkHandler(params));
    this.connection.onDocumentSymbol((documentSymbolParams) => this.documentSymbolHandler(documentSymbolParams));
    this.connection.onDocumentFormatting((formatParams) => this.formatterHandler(formatParams));
    this.connection.onHover((textDocumentPositionParams) => this.hoverHandler(textDocumentPositionParams));
    this.connection.onCompletion((textDocumentPosition) => this.completionHandler(textDocumentPosition));
    this.connection.onDidChangeWatchedFiles((change) => this.watchedFilesHandler(change));
    this.connection.onFoldingRanges((params) => this.foldingRangeHandler(params));
    this.connection.onSelectionRanges((params) => this.selectionRangeHandler(params));
    this.connection.onCodeAction((params) => this.codeActionHandler(params));
    this.connection.onDocumentOnTypeFormatting((params) => this.formatOnTypeHandler(params));
    this.connection.onCodeLens((params) => this.codeLensHandler(params));
    this.connection.onCodeLensResolve((params) => this.codeLensResolveHandler(params));
    this.connection.onDefinition((params) => this.definitionHandler(params));
    this.connection.onDeclaration((params) => this.declarationHandler(params));
    this.connection.onDidSaveTextDocument((params) => {
      read2(params.textDocument.uri, this.yamlSettings, (content) => {
        if (!content.includes('Traceback')) {
          console.log('Adding new schema');
          this.languageService.addSchema2(params.textDocument.uri, content, this.languageService);
        }
        else {
          console.log(`content error: ${content}`)
        }
      }, this.languageService.pythonPath
      )
    });
    this.connection.onRequest(SemanticTokensRequest.type, async (params) => {
      // console.log(`${params.textDocument.uri}`)
      return {data: []}
    });
    this.yamlSettings.documents.onDidChangeContent((change) => {
      // @ts-ignore
      this.cancelLimitExceededWarnings(change.document.uri)
      this.fetchNewSchema(change);
      return;
      clearTimeout(this.fetchCallback)
      this.fetchCallback = setTimeout(() => {
        this.fetchNewSchema(change);
      }, 1000);
    }
    );
    this.yamlSettings.documents.onDidClose((event) => this.cancelLimitExceededWarnings(event.document.uri));
  }

  fetchNewSchema(change: TextDocumentChangeEvent<TextDocument>, ignoreFetch = true) {
    const oldTree = this.languageService.trees.get(change.document.uri);
    if (oldTree) {
      const previousActions = Array.from(oldTree.state.actions.keys());
      const source = change.document.getText();
      const newState = get_state(source, this.languageService.stateQuery);
      const newActions = Array.from(newState[1].actions.keys());
      const shouldFetch = previousActions.filter(item => !newActions.includes(item));
      // console.log(`shouldFetch: ${shouldFetch.length}`);
      // console.log(`prev: ${previousActions}`);
      // console.log(`new: ${newActions}`);
      this.languageService.trees.set(change.document.uri, { tree: newState[0], state: newState[1] });
      if (shouldFetch.length == 0 || ignoreFetch) {
        return;
      }
      const document = this.yamlSettings.documents.get(change.document.uri);
      if (!this.languageService.hasAsyncFlows(document)) {
        return undefined;
      }
      read2(change.document.uri, this.yamlSettings, (content) => {
        if (!content.includes('Traceback')) {
          this.languageService.addSchema2(change.document.uri, content, this.languageService);
        }
        else {
          console.log(`content error: ${content}`)
        }
      }, this.languageService.pythonPath
      );
    }
  }

  documentLinkHandler(params: DocumentLinkParams): Promise<DocumentLink[]> {
    const document = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!document) {
      return Promise.resolve([]);
    }

    return this.languageService.findLinks(document);
  }

  /**
   * Called when the code outline in an editor needs to be populated
   * Returns a list of symbols that is then shown in the code outline
   */
  documentSymbolHandler(documentSymbolParams: DocumentSymbolParams): DocumentSymbol[] | SymbolInformation[] {
    const document = this.yamlSettings.documents.get(documentSymbolParams.textDocument.uri);

    if (!document) {
      return;
    }
    // if (!this.languageService.asyncFlowsDocs.has(documentSymbolParams.textDocument.uri)) {
    //   return;
    // }

    const onResultLimitExceeded = this.onResultLimitExceeded(
      document.uri,
      this.yamlSettings.maxItemsComputed,
      'document symbols'
    );

    const context = { resultLimit: this.yamlSettings.maxItemsComputed, onResultLimitExceeded };

    if (this.yamlSettings.hierarchicalDocumentSymbolSupport) {
      return this.languageService.findDocumentSymbols2(document, context);
    } else {
      return this.languageService.findDocumentSymbols(document, context);
    }
  }

  /**
   * Called when the formatter is invoked
   * Returns the formatted document content using prettier
   */
  formatterHandler(formatParams: DocumentFormattingParams): TextEdit[] {
    const document = this.yamlSettings.documents.get(formatParams.textDocument.uri);

    if (!document) {
      return;
    }

    const customFormatterSettings = {
      tabWidth: formatParams.options.tabSize,
      ...this.yamlSettings.yamlFormatterSettings,
    };

    return this.languageService.doFormat(document, customFormatterSettings);
  }

  formatOnTypeHandler(params: DocumentOnTypeFormattingParams): Promise<TextEdit[] | undefined> | TextEdit[] | undefined {
    const document = this.yamlSettings.documents.get(params.textDocument.uri);

    if (!document) {
      return;
    }
    return this.languageService.doDocumentOnTypeFormatting(document, params);
  }

  /**
   * Called when the user hovers with their mouse over a keyword
   * Returns an informational tooltip
   */
  hoverHandler(textDocumentPositionParams: TextDocumentPositionParams): Promise<Hover> {
    const document = this.yamlSettings.documents.get(textDocumentPositionParams.textDocument.uri);

    if (!document) {
      return Promise.resolve(undefined);
    }

    return this.languageService.doHover(document, textDocumentPositionParams.position);
  }

  /**
   * Called when auto-complete is triggered in an editor
   * Returns a list of valid completion items
   */
  completionHandler(textDocumentPosition: TextDocumentPositionParams): Promise<CompletionList> {
    const textDocument = this.yamlSettings.documents.get(textDocumentPosition.textDocument.uri);

    const result: CompletionList = {
      items: [],
      isIncomplete: false,
    };

    if (!textDocument) {
      return Promise.resolve(result);
    }
    return this.languageService.doComplete(
      textDocument,
      textDocumentPosition.position,
      isKubernetesAssociatedDocument(textDocument, this.yamlSettings.specificValidatorPaths)
    );
  }

  /**
   * Called when a monitored file is changed in an editor
   * Re-validates the entire document
   */
  watchedFilesHandler(change: DidChangeWatchedFilesParams): void {
    let hasChanges = false;

    change.changes.forEach((c) => {
      if (this.languageService.resetSchema(c.uri)) {
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.yamlSettings.documents.all().forEach((document) => this.validationHandler.validate(document));
    }
  }

  foldingRangeHandler(params: FoldingRangeParams): Promise<FoldingRange[] | undefined> | FoldingRange[] | undefined {
    const textDocument = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }

    const capabilities = this.yamlSettings.capabilities.textDocument.foldingRange;
    const rangeLimit = this.yamlSettings.maxItemsComputed || capabilities.rangeLimit;
    const onRangeLimitExceeded = this.onResultLimitExceeded(textDocument.uri, rangeLimit, 'folding ranges');

    const context = {
      rangeLimit,
      onRangeLimitExceeded,
      lineFoldingOnly: capabilities.lineFoldingOnly,
    };

    return this.languageService.getFoldingRanges(textDocument, context);
  }

  selectionRangeHandler(params: SelectionRangeParams): SelectionRange[] | undefined {
    const textDocument = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }

    return this.languageService.getSelectionRanges(textDocument, params.positions);
  }

  codeActionHandler(params: CodeActionParams): CodeAction[] | undefined {
    const textDocument = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }

    return this.languageService.getCodeAction(textDocument, params);
  }

  codeLensHandler(params: CodeLensParams): PromiseLike<CodeLens[] | undefined> | CodeLens[] | undefined {
    const textDocument = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }
    return this.languageService.getCodeLens(textDocument);
  }

  codeLensResolveHandler(param: CodeLens): PromiseLike<CodeLens> | CodeLens {
    return this.languageService.resolveCodeLens(param);
  }

  declarationHandler(params: DeclarationParams): DeclarationLink[] {
    const textDocument = params.textDocument;
    const point = { row: params.position.line, column: params.position.character };
    const treeItem = this.languageService.trees.get(textDocument.uri);
    let declarationLink: DeclarationLink | undefined = undefined;
    if (treeItem) {
      const links = treeItem.state.links;
      let linkValue: SyntaxNode | undefined = undefined;
      for (const link of links.values()) {
        const value = link.link_value;
        if (!value) {
          continue;
        }
        if (point.row == value.startPosition.row &&
          point.column >= value.startPosition.column && point.column <= value.endPosition.column) {
          linkValue = value;
          break;
        }
      }
      if (!linkValue) {
        return [];
      }
      const actionName = linkValue.text.split('.');
      const action = treeItem.state.actions.get(actionName[0]);
      if (!action) {
        return [];
      }
      const node = action.action_name;
      const start = { line: node.startPosition.row, character: node.startPosition.column };
      const end = { line: node.endPosition.row, character: node.endPosition.column };
      declarationLink = {
        targetRange: { end, start },
        targetSelectionRange: { end, start },
        targetUri: textDocument.uri
      };
      return [declarationLink];
    }
    return [];
  }

  definitionHandler(params: DefinitionParams): DefinitionLink[] {
    const textDocument = this.yamlSettings.documents.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }
    const declaration = this.declarationHandler(params);
    if (declaration) {
      return declaration;
    }

    return this.languageService.doDefinition(textDocument, params);
  }

  // Adapted from:
  // https://github.com/microsoft/vscode/blob/94c9ea46838a9a619aeafb7e8afd1170c967bb55/extensions/json-language-features/server/src/jsonServer.ts#L172
  private cancelLimitExceededWarnings(uri: string): void {
    const warning = this.pendingLimitExceededWarnings[uri];
    if (warning && warning.timeout) {
      clearTimeout(warning.timeout);
      delete this.pendingLimitExceededWarnings[uri];
    }
  }

  private onResultLimitExceeded(uri: string, resultLimit: number, name: string) {
    return () => {
      let warning = this.pendingLimitExceededWarnings[uri];
      if (warning) {
        if (!warning.timeout) {
          // already shown
          return;
        }
        warning.features[name] = name;
        warning.timeout.refresh();
      } else {
        warning = { features: { [name]: name } };
        warning.timeout = setTimeout(() => {
          this.connection.sendNotification(
            ResultLimitReachedNotification.type,
            `${path.basename(uri)}: For performance reasons, ${Object.keys(warning.features).join(
              ' and '
            )} have been limited to ${resultLimit} items.`
          );
          warning.timeout = undefined;
        }, 2000);
        this.pendingLimitExceededWarnings[uri] = warning;
      }
    };
  }
}
