/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { get_state, initQuery, initYamlParser, query_flows } from '../../tree_sitter_queries/queries';
import { Connection, Position, Range, SemanticTokensRefreshRequest } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Diagnostic } from 'vscode-languageserver-types';
import { isKubernetesAssociatedDocument } from '../../languageservice/parser/isKubernetes';
import { removeDuplicatesObj } from '../../languageservice/utils/arrUtils';
import { LanguageService } from '../../languageservice/yamlLanguageService';
import { SettingsState } from '../../yamlSettings';
import { writeFileSync } from 'fs';

export class ValidationHandler {
  private languageService: LanguageService;
  private yamlSettings: SettingsState;
  public jinjaCallback: NodeJS.Timeout

  constructor(private readonly connection: Connection, languageService: LanguageService, yamlSettings: SettingsState) {
    this.languageService = languageService;
    this.yamlSettings = yamlSettings;

    this.languageService.doValidation2 = (textDocument: TextDocument, with_jinja = false) => {
      this.validate(textDocument);
    }

    this.connection.onDidCloseTextDocument((event) => {
      const document = this.yamlSettings.documents2.get(event.textDocument.uri);
      if(!document) {
      this.connection.sendDiagnostics({ uri: event.textDocument.uri, diagnostics: [] });
        return ;
      }
      console.log(`doc: ${document}`);
      this.cleanPendingValidation(document);
      this.connection.sendDiagnostics({ uri: event.textDocument.uri, diagnostics: [] });
    });
  }

  validate(textDocument: TextDocument): void {
    this.cleanPendingValidation(textDocument);
    this.yamlSettings.pendingValidationRequests[textDocument.uri] = setTimeout(() => {
      delete this.yamlSettings.pendingValidationRequests[textDocument.uri];
      this.validateTextDocument(textDocument);
    }, this.yamlSettings.validationDelayMs);
  }

  private cleanPendingValidation(textDocument: TextDocument): void {
    const request = this.yamlSettings.pendingValidationRequests[textDocument.uri];

    if (request) {
      if (typeof request == "number") {
        clearTimeout(request as number);
      }
      delete this.yamlSettings.pendingValidationRequests[textDocument.uri];
    }
  }

  validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
    if (!textDocument) {
      return;
    }

    return this.languageService
      .doValidation(textDocument, isKubernetesAssociatedDocument(textDocument, this.yamlSettings.specificValidatorPaths))
      .then((diagnosticResults) => {
        const diagnostics: Diagnostic[] = [];
        const ranges: Range[] = [];
        for (const diagnosticItem of diagnosticResults) {
          // Convert all warnings to errors
          if (diagnosticItem.severity === 2) {
            diagnosticItem.severity = 1;
          }
          diagnostics.push(diagnosticItem);
          ranges.push(diagnosticItem.range);
        }

        const removeDuplicatesDiagnostics = removeDuplicatesObj(diagnostics);
        // this.connection.sendDiagnostics({
        //   uri: textDocument.uri,
        //   diagnostics: removeDuplicatesDiagnostics,
        // });
        this.languageService.yamlDiagnosticsRange.set(textDocument.uri, ranges);
        clearTimeout(this.jinjaCallback);
        this.jinjaCallback = setTimeout(() => {
          this.languageService.resetJinjaVariables(textDocument.uri, removeDuplicatesDiagnostics);
          if(this.languageService.resetSemanticTokens.get(textDocument.uri) == true) {
            this.connection.sendRequest(SemanticTokensRefreshRequest.method).then((v)=>{
              this.languageService.resetSemanticTokens.set(textDocument.uri, false);
            })
          }
        }, 50);
        return removeDuplicatesDiagnostics;
      });
  }
}
