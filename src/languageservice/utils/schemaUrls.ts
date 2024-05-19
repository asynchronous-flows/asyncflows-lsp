import { WorkspaceFolder } from 'vscode-languageserver-protocol';
import { URI } from 'vscode-uri';
import { Telemetry } from '../telemetry';
import { JSONSchema, JSONSchemaRef } from '../jsonSchema';
import { isBoolean } from './objects';
import { isRelativePath, relativeToAbsolutePath } from './paths';


export function checkSchemaURI(
  workspaceFolders: WorkspaceFolder[],
  workspaceRoot: URI,
  uri: string,
  _telemetry: Telemetry
): string {
  if (isRelativePath(uri)) {
    return relativeToAbsolutePath(workspaceFolders, workspaceRoot, uri);
  } else {
    return uri;
  }
}

/**
 * Collect all urls of sub schemas
 * @param schema the root schema
 * @returns map url to schema
 */
export function getSchemaUrls(schema: JSONSchema): Map<string, JSONSchema> {
  const result = new Map<string, JSONSchema>();
  if (!schema) {
    return result;
  }

  if (schema.url) {
    if (schema.url.startsWith('schemaservice://combinedSchema/')) {
      addSchemasForOf(schema, result);
    } else {
      result.set(schema.url, schema);
    }
  } else {
    addSchemasForOf(schema, result);
  }
  return result;
}

function addSchemasForOf(schema: JSONSchema, result: Map<string, JSONSchema>): void {
  if (schema.allOf) {
    addInnerSchemaUrls(schema.allOf, result);
  }
  if (schema.anyOf) {
    addInnerSchemaUrls(schema.anyOf, result);
  }
  if (schema.oneOf) {
    addInnerSchemaUrls(schema.oneOf, result);
  }
}

function addInnerSchemaUrls(schemas: JSONSchemaRef[], result: Map<string, JSONSchema>): void {
  for (const subSchema of schemas) {
    if (!isBoolean(subSchema) && subSchema.url && !result.has(subSchema.url)) {
      result.set(subSchema.url, subSchema);
    }
  }
}
