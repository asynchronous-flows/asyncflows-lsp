/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { configure as configureHttpRequests, xhr } from 'request-light';
import { Connection, DidChangeConfigurationNotification, DocumentFormattingRequest } from 'vscode-languageserver';
import { convertErrorToTelemetryMsg } from '../../languageservice/utils/objects';
import { isRelativePath, relativeToAbsolutePath } from '../../languageservice/utils/paths';
import { checkSchemaURI } from '../../languageservice/utils/schemaUrls';
import { LanguageService, LanguageSettings, SchemaPriority, SchemasSettings } from '../../languageservice/yamlLanguageService';
import { SchemaSelectionRequests } from '../../requestTypes';
import { Settings, SettingsState } from '../../yamlSettings';
import { Telemetry } from '../../languageservice/telemetry';
import { ValidationHandler } from './validationHandlers';
import actionSchema from '../../asyncflows_schema';


export class SettingsHandler {
  constructor(
    private readonly connection: Connection,
    private languageService: LanguageService,
    private readonly yamlSettings: SettingsState,
    private readonly validationHandler: ValidationHandler,
    private readonly telemetry: Telemetry
  ) {
  }

  async registerHandlers(): Promise<void> {
    this.languageService.addSchema2 = (uri, content, ls) => {
      this.configureFromPython(uri, content, ls);
    }
    if (this.yamlSettings.hasConfigurationCapability && this.yamlSettings.clientDynamicRegisterSupport) {
      try {
        // Register for all configuration changes.
        await this.connection.client.register(DidChangeConfigurationNotification.type);
      } catch (err) {
        this.telemetry.sendError('yaml.settings.error', { error: convertErrorToTelemetryMsg(err) });
      }
    }
    this.connection.onDidChangeConfiguration(() => this.pullConfiguration());
  }

  /**
   *  The server pull the 'yaml', 'http.proxy', 'http.proxyStrictSSL', '[yaml]' settings sections
   */
  async pullConfiguration(): Promise<void> {
    const config = await this.connection.workspace.getConfiguration([
      { section: 'yaml' },
      { section: 'http' },
      { section: '[yaml]' },
      { section: 'editor' },
      { section: 'files' },
    ]);
    const settings: Readonly<Settings> = {
      yaml: config[0],
      http: {
        proxy: config[1]?.proxy ?? '',
        proxyStrictSSL: config[1]?.proxyStrictSSL ?? false,
      },
      yamlEditor: config[2],
      vscodeEditor: config[3],
      files: config[4],
    };
    await this.setConfiguration(settings);
  }

  private async setConfiguration(settings: Settings): Promise<void> {
    configureHttpRequests(settings.http && settings.http.proxy, settings.http && settings.http.proxyStrictSSL);

    this.yamlSettings.specificValidatorPaths = [];
    if (settings.yaml) {
      if (Object.prototype.hasOwnProperty.call(settings.yaml, 'schemas')) {
        this.yamlSettings.yamlConfigurationSettings = settings.yaml.schemas;
      }
      if (Object.prototype.hasOwnProperty.call(settings.yaml, 'validate')) {
        this.yamlSettings.yamlShouldValidate = settings.yaml.validate;
      }
      if (Object.prototype.hasOwnProperty.call(settings.yaml, 'hover')) {
        this.yamlSettings.yamlShouldHover = settings.yaml.hover;
      }
      if (Object.prototype.hasOwnProperty.call(settings.yaml, 'completion')) {
        this.yamlSettings.yamlShouldCompletion = settings.yaml.completion;
      }
      this.yamlSettings.customTags = settings.yaml.customTags ? settings.yaml.customTags : [];

      this.yamlSettings.maxItemsComputed = Math.trunc(Math.max(0, Number(settings.yaml.maxItemsComputed))) || 5000;

      if (settings.yaml.schemaStore) {
        this.yamlSettings.schemaStoreEnabled = settings.yaml.schemaStore.enable;
        if (settings.yaml.schemaStore.url.length !== 0) {
        }
      }
      if (settings.files?.associations) {
        for (const [ext, languageId] of Object.entries(settings.files.associations)) {
          if (languageId === 'yaml') {
            this.yamlSettings.fileExtensions.push(ext);
          }
        }
      }
      this.yamlSettings.yamlVersion = settings.yaml.yamlVersion ?? '1.2';

      if (settings.yaml.format) {
        this.yamlSettings.yamlFormatterSettings = {
          proseWrap: settings.yaml.format.proseWrap || 'preserve',
          printWidth: settings.yaml.format.printWidth || 80,
        };

        if (settings.yaml.format.singleQuote !== undefined) {
          this.yamlSettings.yamlFormatterSettings.singleQuote = settings.yaml.format.singleQuote;
        }

        if (settings.yaml.format.bracketSpacing !== undefined) {
          this.yamlSettings.yamlFormatterSettings.bracketSpacing = settings.yaml.format.bracketSpacing;
        }

        if (settings.yaml.format.enable !== undefined) {
          this.yamlSettings.yamlFormatterSettings.enable = settings.yaml.format.enable;
        }
      }
      this.yamlSettings.disableAdditionalProperties = settings.yaml.disableAdditionalProperties;
      this.yamlSettings.disableDefaultProperties = settings.yaml.disableDefaultProperties;

      if (settings.yaml.suggest) {
        this.yamlSettings.suggest.parentSkeletonSelectedFirst = settings.yaml.suggest.parentSkeletonSelectedFirst;
      }
      this.yamlSettings.style = {
        flowMapping: settings.yaml.style?.flowMapping ?? 'allow',
        flowSequence: settings.yaml.style?.flowSequence ?? 'allow',
      };
      this.yamlSettings.keyOrdering = settings.yaml.keyOrdering ?? false;
    }

    this.yamlSettings.schemaConfigurationSettings = [];

    let tabSize = 2;
    if (settings.vscodeEditor) {
      tabSize =
        !settings.vscodeEditor['detectIndentation'] && settings.yamlEditor ? settings.yamlEditor['editor.tabSize'] : tabSize;
    }

    if (settings.yamlEditor && settings.yamlEditor['editor.tabSize']) {
      this.yamlSettings.indentation = ' '.repeat(tabSize);
    }

    if (this.yamlSettings.asyncflowsConfig && this.yamlSettings.schemaStoreSettings.length == 0) {
      // const globPattern = this.yamlSettings.asyncflowsConfig.configs;
      // const schemaObj = {
      //   fileMatch: Array.isArray(globPattern) ? globPattern : [globPattern],
      //   uri: checkSchemaURI(this.yamlSettings.workspaceFolders, this.yamlSettings.workspaceRoot, "asyncflows_schema.json", this.telemetry),
      // };
      // this.yamlSettings.schemaConfigurationSettings.push(schemaObj);
    }

    for (const uri in this.yamlSettings.yamlConfigurationSettings) {
      const globPattern = this.yamlSettings.yamlConfigurationSettings[uri];

      const schemaObj = {
        fileMatch: Array.isArray(globPattern) ? globPattern : [globPattern],
        uri: checkSchemaURI(this.yamlSettings.workspaceFolders, this.yamlSettings.workspaceRoot, uri, this.telemetry),
      };
      this.yamlSettings.schemaConfigurationSettings.push(schemaObj);
    }

    // await this.setSchemaStoreSettingsIfNotSet();
    this.updateConfiguration();
    if (this.yamlSettings.useSchemaSelectionRequests) {
      this.connection.sendNotification(SchemaSelectionRequests.schemaStoreInitialized, {});
    }

    // dynamically enable & disable the formatter
    if (this.yamlSettings.clientDynamicRegisterSupport) {
      const enableFormatter = settings && settings.yaml && settings.yaml.format && settings.yaml.format.enable;

      if (enableFormatter) {
        if (!this.yamlSettings.formatterRegistration) {
          this.yamlSettings.formatterRegistration = this.connection.client.register(DocumentFormattingRequest.type, {
            documentSelector: [{ language: 'yaml' }],
          });
        }
      } else if (this.yamlSettings.formatterRegistration) {
        this.yamlSettings.formatterRegistration.then((r) => {
          return r.dispose();
        });
        this.yamlSettings.formatterRegistration = null;
      }
    }
  }

  /**
   * This function helps set the schema store if it hasn't already been set
   * AND the schema store setting is enabled. If the schema store setting
   * is not enabled we need to clear the schemas.
   */
  private async setSchemaStoreSettingsIfNotSet(): Promise<void> {
    const schemaStoreIsSet = this.yamlSettings.schemaStoreSettings.length !== 0;

    if (this.yamlSettings.schemaStoreEnabled && !schemaStoreIsSet) {
      try {
      } catch (err) {
        // ignore
      }
    } else if (!this.yamlSettings.schemaStoreEnabled) {
      this.yamlSettings.schemaStoreSettings = [];
    }
  }

  /**
   * When the schema store is enabled, download and store YAML schema associations
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async getSchemaStoreMatchingSchemas(schemaStoreUrl: string): Promise<{ schemas: any[] }> {
    const response = await xhr({ url: schemaStoreUrl });

    const languageSettings = {
      schemas: [],
    };

    // Parse the schema store catalog as JSON
    const schemas = JSON.parse(response.responseText);

    for (const schemaIndex in schemas.schemas) {
      const schema = schemas.schemas[schemaIndex];

      if (schema && schema.fileMatch) {
        for (const fileMatch in schema.fileMatch) {
          const currFileMatch: string = schema.fileMatch[fileMatch];
          // If the schema is for files with a YAML extension, save the schema association
          if (
            this.yamlSettings.fileExtensions.findIndex((value) => {
              return currFileMatch.indexOf(value) > -1;
            }) > -1
          ) {
            languageSettings.schemas.push({
              uri: schema.url,
              fileMatch: [currFileMatch],
              priority: SchemaPriority.SchemaStore,
              name: schema.name,
              description: schema.description,
              versions: schema.versions,
            });
          }
        }
      }
    }
    return languageSettings;
  }

  storeDefaultSchema(fileMatch: string) {
    // this.languageService.updatedSchema.


    this.languageService.updatedSchema.set('asyncflows_schema.json', actionSchema);
    // const languageSettings = {
    //   schemas: [],
    // };
    // if (fileMatch.endsWith("/")) {
    //   fileMatch += "*";
    // }
    // else {
    //   fileMatch += "/*"
    // }

    return {
      uri: "asyncflows_schema.json",
      fileMatch: [fileMatch],
      priority: SchemaPriority.SchemaAssociation,
      name: "asyncflows",
      description: "Description",
    };
  }

  /**
   * Called when server settings or schema associations are changed
   * Re-creates schema associations and re-validates any open YAML files
   */
  private updateConfiguration(): void {
    let languageSettings: LanguageSettings = {
      validate: this.yamlSettings.yamlShouldValidate,
      hover: this.yamlSettings.yamlShouldHover,
      completion: this.yamlSettings.yamlShouldCompletion,
      schemas: [],
      customTags: this.yamlSettings.customTags,
      format: this.yamlSettings.yamlFormatterSettings.enable,
      indentation: this.yamlSettings.indentation,
      disableAdditionalProperties: this.yamlSettings.disableAdditionalProperties,
      disableDefaultProperties: this.yamlSettings.disableDefaultProperties,
      parentSkeletonSelectedFirst: this.yamlSettings.suggest.parentSkeletonSelectedFirst,
      flowMapping: this.yamlSettings.style?.flowMapping,
      flowSequence: this.yamlSettings.style?.flowSequence,
      yamlVersion: this.yamlSettings.yamlVersion,
      keyOrdering: this.yamlSettings.keyOrdering,
    };

    if (this.yamlSettings.schemaAssociations) {
      if (Array.isArray(this.yamlSettings.schemaAssociations)) {
        this.yamlSettings.schemaAssociations.forEach((association) => {
          languageSettings = this.configureSchemas(
            association.uri,
            association.fileMatch,
            association.schema,
            languageSettings,
            SchemaPriority.SchemaAssociation
          );
        });
      } else {
        for (const uri in this.yamlSettings.schemaAssociations) {
          const fileMatch = this.yamlSettings.schemaAssociations[uri];
          languageSettings = this.configureSchemas(uri, fileMatch, null, languageSettings, SchemaPriority.SchemaAssociation);
        }
      }
    }

    let foundActionSchema = false;
    if (this.yamlSettings.schemaConfigurationSettings) {
      this.yamlSettings.schemaConfigurationSettings.forEach((schema) => {
        let uri = schema.uri;
        if (uri == "asyncflows_schema.json") {
          foundActionSchema = true;
        }
        if (!uri && schema.schema) {
          uri = schema.schema.id;
        }
        if (!uri && schema.fileMatch) {
          uri = 'vscode://schemas/custom/' + encodeURIComponent(schema.fileMatch.join('&'));
        }
        if (uri) {
          if (isRelativePath(uri)) {
            uri = relativeToAbsolutePath(this.yamlSettings.workspaceFolders, this.yamlSettings.workspaceRoot, uri);
          }

          languageSettings = this.configureSchemas(
            uri,
            schema.fileMatch,
            schema.schema,
            languageSettings,
            SchemaPriority.Settings
          );
        }
      });
    }
    if (true) {
      // if (this.yamlSettings.schemaConfigurationSettings.length == 0) {
      // on load do this
      const config = this.yamlSettings.asyncflowsConfig;
      if (config) {
        languageSettings.schemas.push(this.storeDefaultSchema(config.configs));
      }
    }

    this.languageService.configure(languageSettings);

    // Revalidate any open text documents
    this.yamlSettings.documents2.forEach((document) => {
      this.validationHandler.validate(document)
    });

  }

  configureFromPython(uri: string, content: string, languageService: LanguageService) {
    // this.updateConfiguration();
    // return ;
    let schemaIndex = undefined;
    for (let i = 0; i < this.yamlSettings.schemaConfigurationSettings.length; i++) {
      if (this.yamlSettings.schemaConfigurationSettings[i].uri == uri) {
        schemaIndex = i;
        break;
      }
    }
    try {
      const parsed = JSON.parse(content);
      languageService.updatedSchema.set(uri, parsed);
      if (schemaIndex == undefined) {
        // schema is new
        const schemaSettings: SchemasSettings = {
          fileMatch: [uri.replace('file://', '')],
          uri: uri,
          name: uri.split('/').at(-1),
          priority: SchemaPriority.SchemaAssociation,
          description: ""
        };
        this.yamlSettings.schemaConfigurationSettings.push(
          schemaSettings
        )
      }
      console.log('Updating configuration')
      this.updateConfiguration();
      this.getAllActionEnums(parsed, uri);
      return;
    }
    catch (e) {
      console.log(`error happens here:\n ${e}`);
      console.log(content);
    }
  }

  getAllActionEnums(schema: any, uri: string) {
    const links = [];
    const hintLiteral = schema.$defs['__LinkHintLiteral'];
    const values = hintLiteral.anyOf;
    if ((values instanceof Array) == false) {
      return;
    }
    for (const l of values) {
      if (!l.description) {
        l.description = ""
      }
      if (!l.markdownDescription) {
        l.markdownDescription = "";
      }
      const enumValues = l.enum;
      for (const e of enumValues) {
        links.push({ name: e, description: l.markdownDescription });
      }
    }
    this.languageService.globalJinjaActions.set(uri, links)
    this.languageService.safeFunction(() => {
      this.languageService.jinjaTemplates.addGlobalContext(
        uri,
        links
      );
    })
  }

  /**
   * Stores schema associations in server settings, handling kubernetes
   * @param uri string path to schema (whether local or online)
   * @param fileMatch file pattern to apply the schema to
   * @param schema schema id
   * @param languageSettings current server settings
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private configureSchemas(
    uri: string,
    fileMatch: string[],
    schema: unknown,
    languageSettings: LanguageSettings,
    priorityLevel: number
  ): LanguageSettings {
    uri = checkSchemaURI(this.yamlSettings.workspaceFolders, this.yamlSettings.workspaceRoot, uri, this.telemetry);

    if (schema === null) {
      languageSettings.schemas.push({ uri, fileMatch: fileMatch, priority: priorityLevel });
    } else {
      languageSettings.schemas.push({ uri, fileMatch: fileMatch, schema: schema, priority: priorityLevel });
    }
    return languageSettings;
  }
}
