/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Connection, Diagnostic, LocationLink, TextDocument, TextDocumentChangeEvent } from 'vscode-languageserver';
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
  Range,
  uinteger,
  TextDocumentEdit,
  SemanticTokenTypes,
  SemanticTokenModifiers,
  ProtocolRequestType0,
  SemanticTokensRefreshRequest,
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
  SemanticTokens,
} from 'vscode-languageserver-types';
import { isKubernetesAssociatedDocument } from '../../languageservice/parser/isKubernetes';
import { LanguageService } from '../../languageservice/yamlLanguageService';
import { SettingsState } from '../../yamlSettings';
import { ValidationHandler } from './validationHandlers';
import { ResultLimitReachedNotification } from '../../requestTypes';
import * as path from 'path';
import { hasAsyncFlows, isInLspRange, LspComment, read2 } from '../../helper';
import { SyntaxNode } from 'tree-sitter';
import { emptyFlowState, get_state, parseNewTree } from '../../tree_sitter_queries/queries';
import { toInputEdit } from '../../tree_sitter_queries/toInputEdit';
import { tokenModifiersLegend, tokenTypesLegend } from '../../semanticTokens';
import { JsIdentifierType } from '@jinja-lsp/functions';

export class LanguageHandlers {
  private languageService: LanguageService;
  private yamlSettings: SettingsState;
  private validationHandler: ValidationHandler;
  pendingLimitExceededWarnings: { [uri: string]: { features: { [name: string]: string }; timeout?: NodeJS.Timeout } };
  public tokenTypes = new Map<string, number>();
  public tokenModifiers = new Map<string, number>();

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
    const [tokenTypes, tokenModifiers] = setSemanticToken();
    this.tokenTypes = tokenTypes;
    this.tokenModifiers = tokenModifiers;
    this.languageService.resetJinjaVariables = (uri, diagnostics = []) => {
      this.resetJinjaVariables(uri, diagnostics);
    }
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
      const document = this.yamlSettings.documents2.get(params.textDocument.uri);
      const comment = this.languageService.hasAsyncFlows(document);
      if (comment.hasComment && comment.length) {
        this.editTopComment(document, comment);
      }
      read2(params.textDocument.uri, this.yamlSettings, (content) => {
        if (!content.includes('Traceback')) {
          console.log('Adding new schema');
          this.languageService.resetSemanticTokens.set(params.textDocument.uri, true);
          this.languageService.addSchema2(params.textDocument.uri, content, this.languageService);
        }
        else {
          console.log(`content error: ${content}`)
        }
      }, this.languageService.pythonPath
      )
    });
    this.connection.onRequest(SemanticTokensRequest.type, async (params) => {
      const data = this.intoSemanticTokens(params.textDocument.uri);
      return { data }
    });
    this.connection.onDidOpenTextDocument((e) => {
      const source = e.textDocument.text;
      // const oldTree = this.languageService.trees.get(e.document.uri);
      const state = get_state(source, this.languageService.stateQuery);
      this.languageService.trees.set(e.textDocument.uri, { tree: state[0], state: state[1] });
      const textDocument = TextDocument.create(e.textDocument.uri,
        e.textDocument.languageId,
        e.textDocument.version,
        source);
      this.yamlSettings.documents2.set(e.textDocument.uri, textDocument);
      this.languageService.doValidation(textDocument, false);
      const comment = this.languageService.hasAsyncFlows(textDocument);
      if (comment.hasComment && comment.length) {
        this.editTopComment(textDocument, comment);
      }
    });
    this.connection.onDidChangeTextDocument((event) => {
      // @ts-ignore
      const changes: DidChangeEvent[] = event.contentChanges;

      for (const change of changes) {
        const textDocument = this.yamlSettings.documents2.get(event.textDocument.uri);
        // const newContent = TextDocument.applyEdits(textDocument, this.convertToTextEdit(changes));
        const newContent = TextDocument.applyEdits(textDocument, [{ newText: change.text, range: change.range }]);
        const newTextDocument = TextDocument.create(textDocument.uri,
          textDocument.languageId,
          event.textDocument.version,
          newContent);
        this.yamlSettings.documents2.set(newTextDocument.uri, newTextDocument);
        const tree = this.languageService.trees.get(newTextDocument.uri);
        if (tree) {
          const inputEdit = toInputEdit(change, newTextDocument);
          const newTree = parseNewTree(newContent, tree.tree, inputEdit);
          this.languageService.trees.set(newTextDocument.uri, { tree: newTree, state: emptyFlowState() });
        }
      }
      const newTextDocument = this.yamlSettings.documents2.get(event.textDocument.uri);
      this.cancelLimitExceededWarnings(event.textDocument.uri);
      this.languageService.doValidation2(newTextDocument, false);
      this.fetchNewSchema(newTextDocument.uri);
    });
    // this.yamlSettings.documents.onDidClose((event) => this.cancelLimitExceededWarnings(event.document.uri));
  }

  resetJinjaVariables(uri: string, diagnostics = []) {
    this.languageService.jinjaTemplates.deleteAll(uri);
    for (const item of this.yamlSettings.documents2.entries()) {
      this.readJinjaBlocks(item[0], diagnostics)
    }
  }

  editTopComment(textDocument: TextDocument, lsp_comment: LspComment) {
    let newText = "# asyncflows-language-server";
    this.connection.workspace.applyEdit({
      label: 'UpdatedTopComment',
      edit: {
        documentChanges: [
          {
            textDocument: { uri: textDocument.uri, version: textDocument.version },
            edits: [{
              newText: "",
              range: {
                start: { character: 0, line: lsp_comment.line },
                end: { character: lsp_comment.length + 1, line: lsp_comment.line }
              }
            },
            {
              newText: newText,
              range: {
                start: {
                  character: 0, line: lsp_comment.line
                },
                end: {
                  character: 0,
                  line: lsp_comment.line
                }
              }
            }

            ]
          }
        ]
      }
    });
    this.connection.window.showInformationMessage('Resolved conflicts with YAML language server.')
  }

  convertToTextEdit(changes: DidChangeEvent[]): TextEdit[] {
    const edits: TextEdit[] = [];
    for (const change of changes) {
      edits.push({ newText: change.text, range: change.range })
    }
    return edits;
  }

  intoSemanticTokens(uri: string): number[] {
    const tree = this.languageService.trees.get(uri);
    const doc = this.yamlSettings.documents2.get(uri);
    if (!tree || !doc || !this.languageService.hasAsyncFlows(doc).hasComment) {
      return [];
    }
    const links = tree.state.links;
    const keys = tree.state.selected_keys;
    const actions = tree.state.actions;
    const positions: AbsolutePosition[] = [];
    const ranges = this.languageService.yamlDiagnosticsRange.get(uri);
    const jinjaLinks = this.languageService.jinjaSemanticTokens.get(uri);
    actions.forEach((value, key) => {
      const position: AbsolutePosition = {
        line: value.action_name.startPosition.row,
        startChar: value.action_name.startPosition.column,
        length: value.action_name.endPosition.column - value.action_name.startPosition.column,
        tokenModifiers: [SemanticTokenModifiers.abstract],
        tokenType: SemanticTokenTypes.function
      };
      positions.push(position);
    });
    keys.forEach((value, key) => {
      if (ranges && isInLspRange(value.semantic_key.startPosition, ranges)) {
        return;
      }
      const position: AbsolutePosition = {
        line: value.semantic_key.startPosition.row,
        startChar: value.semantic_key.startPosition.column,
        length: value.semantic_key.endPosition.column - value.semantic_key.startPosition.column,
        tokenModifiers: [SemanticTokenModifiers.declaration],
        tokenType: SemanticTokenTypes.enum
      };
      positions.push(position);
      const semanticValue = value.semantic_body;
      if (!semanticValue) {
        return;
      }
      if (ranges && isInLspRange(semanticValue.startPosition, ranges)) {
        return;
      }
      const valuePosition: AbsolutePosition = {
        line: semanticValue.startPosition.row,
        startChar: semanticValue.startPosition.column,
        length: semanticValue.endPosition.column - semanticValue.startPosition.column,
        tokenModifiers: [SemanticTokenModifiers.async],
        tokenType: SemanticTokenTypes.event
      };
      positions.push(valuePosition);
    });
    for (const jinjaLink of jinjaLinks) {
      if (jinjaLink.identifierType != JsIdentifierType.Link) {
        continue;
      }
      const linkPosition: AbsolutePosition = {
        line: jinjaLink.start.line,
        startChar: jinjaLink.start.character,
        length: jinjaLink.end.character - jinjaLink.start.character,
        tokenModifiers: [SemanticTokenModifiers.defaultLibrary],
        tokenType: SemanticTokenTypes.operator
      }
      positions.push(linkPosition);
    }
    positions.forEach((item) => {
      const t = item.tokenType;
      const m = item.tokenModifiers[0];
      item.tokenType = this.tokenTypes.get(t as string);
      item.tokenModifiers = this.tokenModifiers.get(m as string);
    });
    positions.sort(this.sortSpans);
    let spans = this.addToLspSpans(positions);
    return spans;
  }

  addToLspSpans(positions: AbsolutePosition[]) {
    const lspSpans: number[] = [];
    let previousLine = 0;
    let previousTokenStart = 0;
    for (let i = 0; i < positions.length; i++) {
      const item = positions[i];
      const line = item.line;
      const character = item.startChar;
      const deltaLine = line - previousLine;
      const deltaStart = previousLine === line ? character - previousTokenStart : character;
      lspSpans.push(deltaLine, deltaStart,
        item.length, item.tokenType as number,
        item.tokenModifiers as number);

      previousTokenStart = character;
      previousLine = line;
    }
    return lspSpans;
  }

  sortSpans(a: AbsolutePosition, b: AbsolutePosition) {
    if (a.line < b.line) {
      return -1;
    }
    if (a.line > b.line) {
      return 1;
    }
    if (a.line == b.line) {
      const aLength = a.startChar + a.length;
      const bLength = b.startChar + b.length;
      if (aLength < bLength) {
        return -1;
      }
      else if (aLength > bLength) {
        return 1;
      }
      else {
        return 0
      }

    }
    return 0;
  }

  fetchNewSchema(uri: string, ignoreFetch = true) {
    const oldTree = this.languageService.trees.get(uri);
    if (oldTree) {
      const previousActions = Array.from(oldTree.state.actions.keys());
      const oldDocument = this.yamlSettings.documents2.get(uri);
      if (!oldDocument) {
        return;
      }
      const source = oldDocument.getText();
      const newState = get_state(source, this.languageService.stateQuery, oldTree.tree);
      const newActions = Array.from(newState[1].actions.keys());
      const shouldFetch = previousActions.filter(item => !newActions.includes(item));
      this.languageService.trees.set(uri, { tree: newState[0], state: newState[1] });
      if (shouldFetch.length == 0 || ignoreFetch) {
        return;
      }
      const document = this.yamlSettings.documents2.get(uri);
      if (!this.languageService.hasAsyncFlows(document).hasComment) {
        return undefined;
      }
      read2(uri, this.yamlSettings, (content) => {
        if (!content.includes('Traceback (most recent')) {
          this.languageService.addSchema2(uri, content, this.languageService);
        }
        else {
          console.log(`content error: ${content}`)
        }
      }, this.languageService.pythonPath
      );
    }
  }

  readJinjaBlocks(uri: string, diagnostics = []) {
    const oldTree = this.languageService.trees.get(uri);
    if (oldTree) {
      const oldDocument = this.yamlSettings.documents2.get(uri);
      if (!oldDocument) {
        return;
      }
      const source = oldDocument.getText();
      const state = oldTree.state;
      const texts = state.texts.entries();
      let tokens = [];
      for (const text of texts) {
        const body = text[1].text_body;
        if (!body) {
          continue;
        }
        const identifiers = this.languageService.jinjaTemplates.addOne(text[0], uri, body.text, body.startPosition.row);
        tokens = tokens.concat(identifiers);
      }
      this.languageService.jinjaSemanticTokens.set(uri, tokens);
      this.publishJinjaDiagnostics(uri, diagnostics).then(() => { });
    }
  }

  async publishJinjaDiagnostics(uri: string, diagnostics: Diagnostic[]) {
    this.connection.sendDiagnostics({
      uri: uri,
      diagnostics: diagnostics,
    });
  }

  documentLinkHandler(params: DocumentLinkParams): Promise<DocumentLink[]> {
    const document = this.yamlSettings.documents2.get(params.textDocument.uri);
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
    const document = this.yamlSettings.documents2.get(documentSymbolParams.textDocument.uri);

    if (!document) {
      return [];
    }
    if (!this.languageService.hasAsyncFlows(document).hasComment) {
      return [];
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
    const document = this.yamlSettings.documents2.get(formatParams.textDocument.uri);

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
    const document = this.yamlSettings.documents2.get(params.textDocument.uri);

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
    const document = this.yamlSettings.documents2.get(textDocumentPositionParams.textDocument.uri);

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
    const textDocument = this.yamlSettings.documents2.get(textDocumentPosition.textDocument.uri);

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
      this.yamlSettings.documents2.forEach((document) => {
        this.validationHandler.validate(document)
      });
    }
  }

  foldingRangeHandler(params: FoldingRangeParams): Promise<FoldingRange[] | undefined> | FoldingRange[] | undefined {
    const textDocument = this.yamlSettings.documents2.get(params.textDocument.uri);
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
    const textDocument = this.yamlSettings.documents2.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }

    return this.languageService.getSelectionRanges(textDocument, params.positions);
  }

  codeActionHandler(params: CodeActionParams): CodeAction[] | undefined {
    const textDocument = this.yamlSettings.documents2.get(params.textDocument.uri);
    if (!textDocument) {
      return;
    }

    return this.languageService.getCodeAction(textDocument, params);
  }

  codeLensHandler(params: CodeLensParams): PromiseLike<CodeLens[] | undefined> | CodeLens[] | undefined {
    const textDocument = this.yamlSettings.documents2.get(params.textDocument.uri);
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
    const doc = this.yamlSettings.documents2.get(params.textDocument.uri);
    if (!doc) {
      return [];
    }
    if (!this.languageService.hasAsyncFlows(doc).hasComment) {
      return [];
    }
    const textDefinition = this.languageService.inJinjaTemplate(doc.uri, params.position);
    if (textDefinition) {
      let locations = this.languageService.jinjaTemplates.gotoDefinition(
        textDefinition[0].text.id,
        doc.uri, textDefinition[2], params.position
      );
      if (!locations) {
        return [];
      }
      const definitions = [];
      const len = locations.length;
      if (len == 0) {
        return [];
      }
      for (const location of locations) {
        let range = location.range;
        if (location.isBackend) {
          const actionName = location.uri.split("-").at(-1).split(".").at(0);
          const tree = this.languageService.trees.get(doc.uri);
          if (!tree) {
            return [];
          }
          const action = tree.state.actions.get(actionName);
          if (!action) {
            return [];
          }
          range = {
            start: {
              character: action.action_name.startPosition.column,
              line: action.action_name.startPosition.row
            },
            end: {
              character: action.action_name.endPosition.column,
              line: action.action_name.endPosition.row
            },
          };
          location.uri = doc.uri;
        }
        definitions.push(LocationLink.create(location.uri, range, range));
      }
      return definitions;
    }

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
    const textDocument = this.yamlSettings.documents2.get(params.textDocument.uri);
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

export declare type DidChangeEvent = {
  /**
   * The range of the document that changed.
   */
  range: Range;
  /**
   * The optional length of the range that got replaced.
   *
   * @deprecated use range instead.
   */
  rangeLength?: uinteger;
  /**
   * The new text for the provided range.
   */
  text: string;
}

function setSemanticToken() {
  const tokenTypes = new Map<string, number>();
  const tokenModifiers = new Map<string, number>();

  tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

  tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

  return [tokenTypes, tokenModifiers]

}

type AbsolutePosition = {
  line: number,
  startChar: number,
  length: number,
  tokenType: string | number,
  tokenModifiers: string[] | number
}
