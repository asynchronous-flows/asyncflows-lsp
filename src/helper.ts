import "path"
import { readFileSync,  statSync } from "fs"
import { parse as tomlParse } from "toml";
import { spawn } from "child_process";
import { SettingsState } from "./yamlSettings";
import { LanguageService, SchemaPriority } from "./languageservice/yamlLanguageService";
import { JSONDocument } from "./languageservice/parser/jsonParser07";
import { SingleYAMLDocument } from "./languageservice/parser/yaml-documents";
import { Point } from "tree-sitter";
import { Position, Range } from "vscode-languageserver";

export function readPyProject(): string | TomlConfig {
  let errors: string | TomlConfig = "Config not found";
  try {
    const data = readFileSync("pyproject.toml", { encoding: 'utf8' });
    try {
      const parsedToml = tomlParse(data);
      const tool = parsedToml['tool'];
      if (tool == undefined) {
        errors = "Tool key in TOML is missing";
        return errors;
      }
      const asyncflows = tool['asyncflows'];
      if (asyncflows == undefined) {
        errors = "Asyncflows key is missing";
        return errors;
      }
      const configs = asyncflows['configs'];
      const actions = asyncflows['actions'];
      if (configs && actions) {
        if (configs == "" || actions == "") {
          errors = "Please input directory";
          return errors;
        }
        if (typeof configs != "string" && typeof actions != "string") {
          errors = "Input directory should be of type `string`"
          return errors;
        }
        const items = [configs, actions];
        let failed = false;
        for (let i = 0; i < items.length; i++) {
          try {
            const stat = statSync(items[i]);
            if (!stat.isDirectory()) {
              errors = `This path: ${items[i]} is not a directory`;
              failed = true;
              return errors;
            }
          }
          catch (e) {
            errors = `This directory: ${items[i]} doesn't exist`;
            failed = true;
            return errors;
          }
        }
        if (failed) {
          console.log(`msg: ${failed}`);
          return errors;
        }
        else {
          errors = { configs, actions };
          return errors;
        }
      }
    }
    catch (e) {
      errors = "pyproject.toml has errors"
    }
  }
  catch (e) {
    errors = "pyproject.toml not found"
  }
  return errors;
}

export interface TomlConfig {
  configs: string,
  actions: string,
}

export function read2(yamlConfig: string,
  settings: SettingsState,
  pythonPath: string,
  languageService: LanguageService,
  toReset = false) {
  const uri = yamlConfig.toString();
  yamlConfig = decodeURIComponent(yamlConfig);
  const cmd = spawn(
    pythonPath,
    ['-m', 'asyncflows.scripts.generate_config_schema', '--flow', yamlConfig.replace("file://", "")],
    {
      stdio: ['ignore', 'pipe', 'pipe', 'pipe']
    }
  );
  let stdoutArray = [];
  let fd3Array = [];
  cmd.stdout.on('data', (data) => {
    stdoutArray.push(data);
  })
  cmd.stdio[3].on('data', (data) => {
    fd3Array.push(data);
  })
  cmd.stderr.on('data', (err) => {
    console.log(`Python output error: ${err.toString()}`);
  })
  cmd.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    let dataBuffer: Buffer;
    if (fd3Array.length != 0) {
      console.log('Loading schema from fd3');
      dataBuffer = Buffer.concat(fd3Array);
    } else {
      console.log('Loading schema from stdout');
      dataBuffer = Buffer.concat(stdoutArray);
    }
    const content = dataBuffer.toString();
    if (!content.includes('Traceback (most recent')) {
      if (toReset) {
        languageService.resetSemanticTokens.set(uri, true);
      }
      languageService.addSchema2(uri, content, languageService);
    }
    else {
      console.log(`content error: ${content}`)
    }
  })
}

export function createSchema(uri: string) {
  const name = uri.split('/').at(-1);
  const fileMatch = uri.replace('file://', '');
  return {
    uri: name,
    fileMatch: [fileMatch],
    priority: SchemaPriority.SchemaAssociation,
    name: `asyncflows_${name}`,
    description: "Description",
  }
}

export function hasAsyncFlows(doc: SingleYAMLDocument | JSONDocument): LspComment {
  if (doc instanceof SingleYAMLDocument) {
    const comments = doc.lineComments.slice(0, 5);
    let counter = 0;
    for (let comment of comments) {
      if (comment.includes("yaml-language-server") && comment.includes("asyncflows_schema.json")) {
        return { hasComment: true, line: counter, length: comment.length };
      }
      else if (comment.includes('asyncflows-lsp') || comment.includes('asyncflows-language-server')) {
        return { hasComment: true, line: counter }
      }
      counter += 1;
    }
  }
  return { hasComment: false }
}

export function toLspPosition(point: Point): Position {
  return { character: point.column, line: point.row };
}

export function toLspRange(startPoint: Point, endPoint: Point): Range {
  const start = toLspPosition(startPoint);
  const end = toLspPosition(endPoint);
  return { start, end };
}

export function isInLspRange(point: Point, ranges: Range[]): boolean {
  const position = toLspPosition(point);
  for (const range of ranges) {
    if (position.character >= range.start.character && position.character <= range.end.character) {
      if (position.line >= range.start.line && position.line <= range.end.line) {
        return true;
      }
    }
  }
  return false;
}

export type LspComment = { hasComment: boolean, line?: number, length?: number };
