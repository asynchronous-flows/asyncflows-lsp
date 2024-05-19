import Parser, { Tree, SyntaxNode, Query, Point } from "tree-sitter";
import {language} from "@tree-sitter-grammars/tree-sitter-yaml"
import yamlTs from '@tree-sitter-grammars/tree-sitter-yaml';

export function query_flows(source: string, query: Query, node: Tree, point: Point, full = true) {
  const root = node.rootNode;
  const results = query.matches(root)
  for(let i = 0; results.length; i++) {
    const result = results[i];
    const captures = result.captures;
    for(let i=0; i < captures.length; i++) {
      console.log(captures[i].name)
    }
  }
}

export function initQuery() {
  return new Query(language, FLOW_QUERY)
}

export function initYamlParser() {
  const parser = typeof Parser;
 // const parser = new Parser();
 // parser.setLanguage(yamlTs);
 return parser;
}


export type FlowState = {
  flows: Flow[],
  links: Link[],
  comments: Comment[],
  output: Output[],
}

export type Link = {
  link_key: SyntaxNode,
  link_value: SyntaxNode
}

export type Flow = {
  flow_name: SyntaxNode,
  flow_body?: SyntaxNode
}

export type Output = {
  output_key: SyntaxNode,
  output_body: SyntaxNode
}

export type Comment = SyntaxNode

export const FLOW_QUERY = `
  (block_mapping_pair
	key: (flow_node) @flow_key
    (#eq? @flow_key "flow")
    
    value: (block_node
    	(block_mapping
        	(block_mapping_pair
            	key: (flow_node) @flow_name
                value: (_) @flow_body
            )
        )
    )
)

(block_mapping_pair
	key: (flow_node) @link_key
    value: (flow_node)? @link_value
    (#eq? @link_key "link")
) @link_pair

(block_mapping_pair
	key: (flow_node) @output_key
    value: (flow_node)? @output_value
    (#eq? @output_key "default_output")
)

(comment)? @comment
`;
