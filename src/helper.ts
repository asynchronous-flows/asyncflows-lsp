import "path"
import { readFile, readFileSync, stat, statSync } from "fs"
import { parse as tomlParse } from "toml";

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
      const venv = asyncflows['venv'];
      if (configs && actions && venv) {
        if (configs == "" || actions == "" || venv == "") {
          errors = "Please input directory";
          return errors;
        }
        if (typeof configs != "string" && typeof actions != "string" && typeof venv != "string") {
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
          try {
            const stat = statSync(venv);
            if (!stat.isFile()) {
              errors = `Python path not found`;
              failed = true;
              return errors;
            }
          }
          catch(e) {
            errors = `Venv path not found`
            failed = true;
            return errors;
          }
        }
        if (failed) {
          return errors;
        }
        else {
          errors = { configs, actions, venv };
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
  venv: string
}
