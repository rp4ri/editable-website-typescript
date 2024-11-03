import { DOMSerializer, DOMParser, Schema, MarkType, NodeType } from 'prosemirror-model';
import { NodeSelection, EditorState, Transaction, SelectionRange, Selection } from 'prosemirror-state';
import { Node as ProseMirrorNode } from 'prosemirror-model';
/**
 * Converts editor state to an HTML string.
 */
export function toHTML(editorState: EditorState): string {
  const serializer = DOMSerializer.fromSchema(editorState.schema);
  const fragment = serializer.serializeFragment(editorState.doc.content);
  const node = document.createElement('div');
  node.appendChild(fragment);
  return node.innerHTML;
}

/**
 * Converts the editor state to plain text.
 */
export function toPlainText(editorState: EditorState): string {
  if (editorState.doc.childCount === 0) {
    return '';
  } else if (editorState.doc.childCount === 1) {
    return editorState.doc.textContent;
  } else {
    const paragraphs: string[] = [];
    for (let i = 0; i < editorState.doc.childCount; i++) {
      paragraphs.push(editorState.doc.child(i).textContent);
    }
    return paragraphs.join('\n');
  }
}

/**
 * Parses HTML content into a ProseMirror document.
 */
export function fromHTML(schema: Schema, content: string): ProseMirrorNode {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = content;
  return DOMParser.fromSchema(schema).parse(doc.body);
}

/**
 * Checks if a mark is active in the current selection.
 */
export function markActive(type: MarkType) {
  return function (state: EditorState): boolean {
    const { from, $from, to, empty } = state.selection;
    if (!type) return false;
    if (empty) return !!type.isInSet(state.storedMarks || $from.marks());
    else return state.doc.rangeHasMark(from, to, type);
  };
}

/**
 * Checks if a node can be inserted at the current selection.
 */
export function canInsert(state: EditorState, nodeType: NodeType): boolean {
  const $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
  }
  return false;
}

/**
 * Checks if a mark can be applied to the current selection.
 */
export function markApplies(
  doc: ProseMirrorNode,
  ranges: readonly SelectionRange[],
  type: MarkType
): boolean {
  for (let i = 0; i < ranges.length; i++) {
    const { $from, $to } = ranges[i];
    let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, (node) => {
      if (can) return false;
      can = node.inlineContent && node.type.allowsMarkType(type);
    });
    if (can) return true;
  }
  return false;
}

/**
 * Checks if the link mark is active in the current selection.
 */
export function linkActive(type: MarkType) {
  return function (state: EditorState): boolean {
    const { from, to } = state.selection;
    return state.doc.rangeHasMark(from, to, type);
  };
}

/**
 * Checks if the block type is active in the current selection.
 */
export function blockTypeActive(type: NodeType, attrs?: { [key: string]: any }) {
  return function (state: EditorState): boolean {
    const { $from, to } = state.selection;
    const dynAttrs = { ...attrs };

    // Check if the selection is a NodeSelection and has the `node` property
    if (state.selection instanceof NodeSelection) {
      const { node } = state.selection;
      if (node.attrs.id) {
        dynAttrs.id = node.attrs.id;
      }
      return node.hasMarkup(type, dynAttrs);
    }

    if ($from.parent && $from.parent.attrs.id) {
      dynAttrs.id = $from.parent.attrs.id;
    }

    // Check if the parent node has the desired markup
    return to <= $from.end() && $from.parent.hasMarkup(type, dynAttrs);
  };
}

/**
 * Retrieves the first mark of a given type at the current selection.
 */
export function getMarkAtCurrentSelection(type: MarkType) {
  return function (state: EditorState) {
    const { $from } = state.selection;
    return $from.marks().find((m) => m.type === type);
  };
}

/**
 * Extends the selection to include the entire mark.
 */
export function markExtend($start: Selection, mark: MarkType) {
  let startIndex = $start.$from.index();
  let endIndex = $start.$from.indexAfter();

  while (startIndex > 0 && mark.isInSet($start.$from.parent.child(startIndex - 1).marks)) {
    startIndex--;
  }
  while (
    endIndex < $start.$from.parent.childCount &&
    mark.isInSet($start.$from.parent.child(endIndex).marks)
  ) {
    endIndex++;
  }

  let startPos = $start.$from.start();
  let endPos = startPos;
  for (let i = 0; i < endIndex; i++) {
    const size = $start.$from.parent.child(i).nodeSize;
    if (i < startIndex) startPos += size;
    endPos += size;
  }
  return { from: startPos, to: endPos };
}
