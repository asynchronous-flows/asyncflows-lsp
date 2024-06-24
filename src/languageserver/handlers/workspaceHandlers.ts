/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initPythonPath, LanguageService, PythonPath } from '../../languageservice/yamlLanguageService';
import { ExecuteCommandParams, Connection, MessageActionItem, ProtocolRequestType0, ShowMessageRequest, ShowMessageRequestParams, MessageType } from 'vscode-languageserver';
import { CommandExecutor } from '../commandExecutor';
import { spawn, spawnSync } from 'child_process';

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
    if (id == "asyncflows-lsp.vscodePythonPath") {
      if (!params.arguments) {
        return;
      }
      if (params.arguments.length > 0) {
        if (params.arguments[1]) {
          this.languageService.pythonPath[1].reject();
          const py: PythonPath = {
            resolve: () => { },
            reject: () => { }
          }
          const pythonPath = initPythonPath(py);
          this.languageService.pythonPath = [pythonPath, py]
        }
        this.languageService.pythonPath[1].resolve(params.arguments[0]);
        this.getAsyncFlows(params.arguments[0]).then(() => { });
      }
    }
  }

  async getAsyncFlows(python = 'python') {
    const cmd = spawn(python, ['-c', 'import asyncflows'])
    cmd.stderr.on('data', (chunk) => {
      const messageParams: ShowMessageRequestParams = {
        type: MessageType.Error,
        message: "asyncflows is not installed in selected python interpreter. Without it, only basic autocompletion is available.\nWould you like to install asyncflows?",
        actions: [
          { title: "Yes" },
          { title: "No" }
        ]
      };

      this.connection.sendRequest(ShowMessageRequest.type, messageParams).then((selectedAction: MessageActionItem | null) => {
        if (selectedAction) {
          if (selectedAction.title == "Yes") {
            const installation = spawn('pip', ['install', 'asyncflows']);
            installation.stdout.on('data', (event) => {
              this.connection.window.showInformationMessage('Asyncflows successfully installed.')
            });
          }
        }
      });
    });
  }
}
