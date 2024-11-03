// src/lib/editor/prosemirrorKeymap.ts

import {
  wrapIn,
  setBlockType,
  chainCommands,
  toggleMark,
  exitCode,
  joinUp,
  joinDown,
  lift,
  selectParentNode,
} from 'prosemirror-commands';
import { wrapInList, splitListItem } from 'prosemirror-schema-list';
import { undo, redo } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { Schema, MarkType, NodeType } from 'prosemirror-model';
import type { Command } from 'prosemirror-state';

const mac: boolean = typeof navigator !== 'undefined'
  ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  : false;

/**
 * Builds a keymap for the given schema, mapping keys to editor commands.
 */
export function buildKeymap(
  schema: Schema,
  mapKeys?: { [key: string]: false | string }
): { [key: string]: Command } {
  let keys: { [key: string]: Command } = {};
  let type: NodeType | MarkType | undefined;

  function bind(key: string, cmd: Command) {
    if (mapKeys) {
      const mapped = mapKeys[key];
      if (mapped === false) return;
      if (mapped) key = mapped;
    }
    keys[key] = cmd;
  }

  bind('Mod-z', undo);
  bind('Shift-Mod-z', redo);
  bind('Backspace', undoInputRule);
  if (!mac) bind('Mod-y', redo);

  bind('Alt-ArrowUp', joinUp);
  bind('Alt-ArrowDown', joinDown);
  bind('Mod-BracketLeft', lift);
  bind('Escape', selectParentNode);

  if ((type = schema.marks.strong)) {
    bind('Mod-b', toggleMark(type));
    bind('Mod-B', toggleMark(type));
  }
  if ((type = schema.marks.em)) {
    bind('Mod-i', toggleMark(type));
    bind('Mod-I', toggleMark(type));
  }
  if ((type = schema.marks.code)) bind('Mod-`', toggleMark(type));

  if ((type = schema.nodes.bullet_list)) bind('Shift-Ctrl-8', wrapInList(type));
  if ((type = schema.nodes.ordered_list)) bind('Shift-Ctrl-9', wrapInList(type));
  if ((type = schema.nodes.blockquote)) bind('Ctrl->', wrapIn(type));
  if ((type = schema.nodes.hard_break)) {
    const br = type;
    const cmd = chainCommands(exitCode, (state, dispatch) => {
      if (dispatch) dispatch(state.tr.replaceSelectionWith(br.create()).scrollIntoView());
      return true;
    });
    bind('Mod-Enter', cmd);
    bind('Shift-Enter', cmd);
    if (mac) bind('Ctrl-Enter', cmd);
  }
  if ((type = schema.nodes.list_item)) {
    bind('Enter', splitListItem(type));
  }
  if ((type = schema.nodes.paragraph)) bind('Shift-Ctrl-0', setBlockType(type));
  if ((type = schema.nodes.code_block)) bind('Shift-Ctrl-\\', setBlockType(type));
  if ((type = schema.nodes.heading)) {
    for (let i = 1; i <= 6; i++) {
      bind('Shift-Ctrl-' + i, setBlockType(type, { level: i }));
    }
  }
  if ((type = schema.nodes.horizontal_rule)) {
    const hr = type;
    bind('Mod-_', (state, dispatch) => {
      if (dispatch) dispatch(state.tr.replaceSelectionWith(hr.create()).scrollIntoView());
      return true;
    });
  }

  return keys;
}
