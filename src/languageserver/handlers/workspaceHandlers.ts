/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initPythonPath, LanguageService, PythonPath } from '../../languageservice/yamlLanguageService';
import { ExecuteCommandParams, Connection, MessageActionItem, ProtocolRequestType0, ShowMessageRequest, ShowMessageRequestParams, MessageType, CodeLensRequest } from 'vscode-languageserver';
import { CommandExecutor } from '../commandExecutor';
import { spawn, spawnSync } from 'child_process';
import { Settings, SettingsState } from '../../yamlSettings';
import { read2 } from '../../helper';
import { extensionLog } from './languageHandlers';

export class WorkspaceHandlers {
  languageService: LanguageService
  languageSettings: SettingsState
  constructor(private readonly connection: Connection, private readonly commandExecutor: CommandExecutor, ls: LanguageService, settings: SettingsState) {
    this.languageService = ls;
    this.languageSettings = settings;
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
          this.languageService.pythonPath[0].then(pythonPath => {
            for (const doc of this.languageSettings.documents2) {
              if(this.languageService.hasAsyncFlows2(doc[1]) == false) {
                continue
              }
              read2(doc[0], this.languageSettings, (content) => {
                if (!content.includes('Traceback')) {
                  console.log('Adding new schema');
                  this.languageService.resetSemanticTokens.set(doc[0], true);
                  this.languageService.addSchema2(doc[0], content, this.languageService);
                }
                else {
                  console.log(`content error: ${content}`)
                }
              }, pythonPath
              );
            }
          })
          // for all documents update schema
        }
        this.languageService.pythonPath[1].resolve(params.arguments[0]);
        this.getAsyncFlows(params.arguments[0]).then(() => { });
      }
    }
  }

  async getAsyncFlows(python = 'python') {
    const cmd = spawn(python, ['-c', 'import asyncflows'])
    cmd.stderr.on('data', (chunk) => {
      console.log("error in updating interpreter");
      const messageParams: ShowMessageRequestParams = {
        type: MessageType.Error,
        message: `asyncflows is not installed in selected python interpreter (${python}). \nWould you like to change interpreter or install asyncflows?`,
        actions: [
          { title: "Change interpreter" },
          { title: "Install" },
        ]
      };

      this.connection.sendRequest(ShowMessageRequest.type, messageParams).then((selectedAction: MessageActionItem | null) => {
        if (selectedAction) {
          if (selectedAction.title == "Install") {
            const installation = spawn('pip', ['install', 'asyncflows']);
            installation.stdout.on('data', (event) => {
              this.connection.window.showInformationMessage('Asyncflows successfully installed.')
            });
          }
          else if (selectedAction.title == "Change interpreter") {
            extensionLog(this.connection, JSON.stringify({t: "setInterpreter"}));
            extensionLog(this.connection);
          }

        }
      });
    });

    cmd.stdout.on('data', (chunk) => {
      console.log(chunk)
    });
  }
}
