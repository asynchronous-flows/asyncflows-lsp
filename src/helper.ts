import "path"
import { readFile, readFileSync, stat, statSync } from "fs"
import { parse as tomlParse } from "toml";
import { spawn } from "child_process";
import { SettingsState } from "./yamlSettings";

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

export function read2(yamlConfig: string, settings: SettingsState, updateConfig: (content: string) => void): string{
  // python scripts/generate_config_schema.py --flow configs/config.yaml
  let output = "";
  const process = spawn("python", ['scripts/generate_config_schema.py', '--flow', yamlConfig.replace("file://", "")]);
  process.stdout.on('data', (data) => {
    output = data.toString() as string;
    // settings.newSchema = output;
    updateConfig(output);
  })
  process.stderr.on('data', (err) => {
    output = err.toString();
    console.log(`Output error: ${err.toString()}`);
  })

  return output;
}
