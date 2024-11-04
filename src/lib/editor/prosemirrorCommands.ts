import { markApplies, canInsert } from '$lib/editor/prosemirrorUtil.js';
import { EditorState, TextSelection } from 'prosemirror-state';
import type { MarkType } from 'prosemirror-model';

export function createLink(state: EditorState): boolean {
	const schema = state.schema;
	const markType: MarkType | undefined = schema.marks.link;
	if (!markType) return false;

	const { ranges, from, to } = state.selection;
	const allowed = markApplies(state.doc, ranges, markType);
	const hasLink = state.doc.rangeHasMark(from, to, markType);

	// Ensure selection is a TextSelection and check for $cursor
	const isTextSelection = state.selection instanceof TextSelection;
	const hasCursor = isTextSelection && (state.selection as TextSelection).$cursor;

	// Disable if cursor is collapsed, mark does not apply, or is already present
	if (hasCursor || !allowed || hasLink) return false;
	return true;
}

export function insertImage(state: EditorState /*, dispatch, editorView, src*/) {
	const nodeType = state.schema.nodes.image;
	if (!nodeType) return false;
	if (!canInsert(state, nodeType)) return false;
	return true;
}
