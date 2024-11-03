// src/lib/editor/prosemirrorInputrules.ts

import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule,
  smartQuotes,
  emDash,
  ellipsis,
  InputRule,
} from 'prosemirror-inputrules';
import { NodeType, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

/**
 * Creates an input rule for block quotes.
 */
export function blockQuoteRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/^\s*>\s$/, nodeType);
}

/**
 * Creates an input rule for ordered lists.
 */
export function orderedListRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(
    /^(\d+)\.\s$/,
    nodeType,
    (match) => ({ order: +match[1] }),
    (match, node) => node.childCount + node.attrs.order === +match[1]
  );
}

/**
 * Creates an input rule for bullet lists.
 */
export function bulletListRule(nodeType: NodeType): InputRule {
  return wrappingInputRule(/^\s*([-+*])\s$/, nodeType);
}

/**
 * Creates an input rule for code blocks.
 */
export function codeBlockRule(nodeType: NodeType): InputRule {
  return textblockTypeInputRule(/^```$/, nodeType);
}

/**
 * Creates an input rule for headings up to a specified level.
 */
export function headingRule(nodeType: NodeType, maxLevel: number): InputRule {
  return textblockTypeInputRule(
    new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType,
    (match) => ({ level: match[1].length })
  );
}

/**
 * Builds a set of input rules for the given schema.
 */
export function buildInputRules(schema: Schema): Plugin {
  let rules: InputRule[] = smartQuotes.concat(ellipsis, emDash);
  let type: NodeType | undefined;

  if ((type = schema.nodes.blockquote)) rules.push(blockQuoteRule(type));
  if ((type = schema.nodes.ordered_list)) rules.push(orderedListRule(type));
  if ((type = schema.nodes.bullet_list)) rules.push(bulletListRule(type));
  if ((type = schema.nodes.code_block)) rules.push(codeBlockRule(type));
  if ((type = schema.nodes.heading)) rules.push(headingRule(type, 6));

  return inputRules({ rules });
}
