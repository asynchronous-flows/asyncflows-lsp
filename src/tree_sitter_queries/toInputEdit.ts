import { DidChangeTextDocumentParams, Range, TextDocumentChangeEvent } from "vscode-languageserver";

export interface TextDocumentContentChangeEvent {
	/**
	 * The range of the document that changed.
	 */
	range?: Range;

	/**
	 * The length of the range that got replaced.
	 */
	rangeLength?: number;

	/**
	 * The new text of the document.
	 */
	text: string;
}

export function toInputEdit(params: TextDocumentChangeEvent<TextDocumentContentChangeEvent>) {
  console.log(`test: ${params.document.range}`)
}
