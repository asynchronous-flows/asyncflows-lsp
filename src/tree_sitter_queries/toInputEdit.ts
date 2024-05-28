import { Edit, Tree } from "tree-sitter";
import { TextDocument } from "vscode-languageserver-textdocument";
import { DidChangeEvent } from "../languageserver/handlers/languageHandlers";

export function toInputEdit(event: DidChangeEvent, doc: TextDocument): Edit {
	const start = event.range.start;
	const end = event.range.end;

	const startIndex = doc.offsetAt(start)

	const newEndIndex = startIndex + event.text.length;
	const newEndPosition = doc.positionAt(newEndIndex);

	const oldEndIndex = doc.offsetAt(end);
	const oldEndPosition = end;

	return {
		startIndex,
		newEndIndex,
		oldEndIndex,
		newEndPosition: { column: newEndPosition.character, row: newEndPosition.line },
		oldEndPosition: { column: oldEndPosition.character, row: oldEndPosition.line },
		startPosition: { column: start.character, row: start.line }
	}
}
