import Parser, { Tree, SyntaxNode, Query, Point, Edit } from "tree-sitter";
const yamlTs = require('@tree-sitter-grammars/tree-sitter-yaml')

const TSParser = require('tree-sitter');
const TSQuery = require('tree-sitter');

export function parseNewTree(source: string, oldTree: Tree | undefined, edit: Edit) {
  const parser = initYamlParser() as Parser;
  if(oldTree) {
    oldTree.edit(edit);
  }
  const newTree = parser.parse(source, oldTree);
  return newTree;
}

export function get_state(source: string, query: Query, oldTree = undefined): [Tree, FlowState] {
  const parser = initYamlParser();
  let tree: Tree = oldTree;
  if (oldTree == undefined) {
    tree = parser.parse(source);
  }
  return [tree, query_flows(source, query, tree, { column: 0, row: 0 }, true)];
}

export function query_flows(source: string, query: Query, node: Tree, point: Point, full = true) {
  const errors = [];
  const root = node.rootNode;
  const flowState: FlowState = emptyFlowState();
  if (root == undefined) {
    return flowState;
  }
  const results = query.matches(root)
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const captures = result.captures;
    let actionName = undefined;
    let link: Link | undefined = undefined;
    for (let i = 0; i < captures.length; i++) {
      const captureName = captures[i].name;
      const node = captures[i].node;
      if (captureName == "action") {
        actionName = captures[i].node.text;
        if (flowState.actions.get(actionName)) {
          errors.push([ActionError.DuplicateActionName, node])
        }
        else {
          flowState.actions.set(actionName, { action_name: node });
        }
      }
      else if (captureName == "action_body") {
        const action = flowState.actions.get(actionName);
        if (action) {
          action.action_body = node;
        }
      }
      else if (captureName == "link_key") {
        if (!flowState.links.get(node.id)) {
          flowState.links.set(node.id, { link_key: node });
          link = flowState.links.get(node.id);
        }
      }
      else if (captureName == "link_value") {
        link!.link_value! = node;
      }
      else if (captureName == "output_key") {
        // if(!flowstatk)
      }
    }
  }
  return flowState;
}

export function initQuery() {
  return new TSQuery.Query(yamlTs, FLOW_QUERY)
}

export function initYamlParser() {
  const parser = new TSParser();
  parser.setLanguage(yamlTs);
  return parser;
}

export enum ActionError {
  DuplicateActionName,
  LinkFormat,
  ActionNotFound,
}

export function formatError(error: ActionError): string {
  switch (error) {
    case ActionError.ActionNotFound:
      return "Action not found"
    case ActionError.DuplicateActionName:
      return "Duplicate action name"
    case ActionError.LinkFormat:
      return "Link format error"
  }
}


export type FlowState = {
  actions: Map<string, Action>,
  links: Map<number, Link>,
  comments: Map<number, Comment>,
  output: Output,
}

export function emptyFlowState(): FlowState {
  return { actions: new Map(), links: new Map(), comments: new Map(), output: {} }
}

export type Link = {
  link_key: SyntaxNode,
  link_value?: SyntaxNode
}

export type Action = {
  action_name: SyntaxNode,
  action_body?: SyntaxNode
}

export type Output = {
  output_key?: SyntaxNode,
  output_body?: SyntaxNode
}

export type Comment = SyntaxNode

export const FLOW_QUERY = `

(block_mapping_pair
	key: (flow_node) @flow_key
    (#eq? @flow_key "flow")
    
    value: (block_node
    	(block_mapping
        	(block_mapping_pair
            	key: (flow_node) @action
                value: (_) @action_body
                
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

(block_mapping_pair
	key: (flow_node) @action_key
    value: (flow_node)? @action_value
    (#eq? @action_key "action")
)

(comment)? @comment  
`;
