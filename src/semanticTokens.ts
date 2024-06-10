import { SemanticTokenModifiers, SemanticTokenTypes } from "vscode-languageserver";

export const tokenTypesLegend = [
  SemanticTokenTypes.namespace,
  SemanticTokenTypes.class,
  SemanticTokenTypes.property,
  SemanticTokenTypes.variable,
  SemanticTokenTypes.enum,
  SemanticTokenTypes.function,
  SemanticTokenTypes.event,
  SemanticTokenTypes.comment,
  SemanticTokenTypes.macro,
  SemanticTokenTypes.operator,
];


export const tokenModifiersLegend = [
  SemanticTokenModifiers.declaration,
  SemanticTokenModifiers.modification,
  SemanticTokenModifiers.abstract,
  SemanticTokenModifiers.async,
  SemanticTokenModifiers.defaultLibrary
  ];
