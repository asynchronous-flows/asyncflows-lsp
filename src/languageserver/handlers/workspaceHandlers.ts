/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { initPythonPath, LanguageService, PythonPath } from '../../languageservice/yamlLanguageService';
import { ExecuteCommandParams, Connection, MessageActionItem, ShowMessageRequest, ShowMessageRequestParams, MessageType } from 'vscode-languageserver';
import { CommandExecutor } from '../commandExecutor';
import { spawn } from 'child_process';
import { SettingsState } from '../../yamlSettings';
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
              if (this.languageService.hasAsyncFlows(doc[1]).hasComment == false) {
                continue
              }
              read2(doc[0], this.languageSettings, pythonPath, this.languageService, true);
            }
          }).catch((_) => { })
        }
      }
      this.getAsyncFlows(params.arguments[0]).then(() => { });
    }
    else if (id == "asyncflows-lsp.vscodePing") {
      extensionLog(this.connection, JSON.stringify({ t: "vscodePing" }));
      extensionLog(this.connection);
    }
  }


  async getAsyncFlows(python = 'python') {
    const cmd = spawn(python, ['-c', 'import asyncflows'])
    cmd.on('close', (code) => {
      if (code == 0) {
        this.languageService.pythonPath[1].resolve(python);
      }
    });
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
            // /home/uros/miniconda3/envs/.venv5/bin/python -m pip install asyncflows
            const installation = spawn(python, ['-m', 'pip', 'install', 'asyncflows']);
            let notification = false;
            installation.stdout.on('data', (event) => {
              if (!notification) {
                this.connection.window.showInformationMessage('Installation started..')
                notification = true;
              }
            });
            installation.stdout.on('end', (_) => {
              this.languageService.pythonPath[1].resolve(python);
              this.connection.window.showInformationMessage('Asyncflows successfully installed.')
            });
          }
          else if (selectedAction.title == "Change interpreter") {
            extensionLog(this.connection, JSON.stringify({ t: "setInterpreter" }));
            extensionLog(this.connection);
          }
        }
      });
    });

  }
}


