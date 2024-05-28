import { initQuery, initYamlParser, query_flows } from '../src/tree_sitter_queries/queries';

import { expect, test } from 'vitest';

// import * as assert from 'assert';
import Parser, {Point} from "tree-sitter";
import fs from 'fs';

test('tree_sitter', () => {
  const source = fs.readFileSync('test/configs/debono.yaml', 'utf8');
  const query = initQuery();
  const parser = initYamlParser();
  const tree = parser.parse(source);
  const flowState = query_flows(source, query, tree, {row: 0, column: 0});
  expect(flowState.actions.size).toBe(6);
  expect(flowState.links.size).toBe(5);
  })
