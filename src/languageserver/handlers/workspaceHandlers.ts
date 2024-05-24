/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LanguageService } from '../../languageservice/yamlLanguageService';
import { ExecuteCommandParams, Connection } from 'vscode-languageserver';
import { CommandExecutor } from '../commandExecutor';

export class WorkspaceHandlers {
  languageService: LanguageService
  constructor(private readonly connection: Connection, private readonly commandExecutor: CommandExecutor, ls: LanguageService) {
    this.languageService = ls;
  }

  registerHandlers(): void {
    this.connection.onExecuteCommand((params) => this.executeCommand(params));
  }

  private executeCommand(params: ExecuteCommandParams): void {
    const id = params.command;
    if(id == "asyncflows-lsp.vscodePythonPath") {
      if (!params.arguments) {
        return ;
      }
      if(params.arguments.length == 1) {
        this.languageService.pythonPath = params.arguments[0]
      }
    }
    // return this.commandExecutor.executeCommand(params);
  }
}
