import type { MarkSpec, DOMOutputSpec } from 'prosemirror-model';
import { Schema } from 'prosemirror-model';

const pDOM: DOMOutputSpec = ['p', 0];
const blockquoteDOM: DOMOutputSpec = ['blockquote', 0];
const brDOM: DOMOutputSpec = ['br'];
const olDOM: DOMOutputSpec = ['ol', 0];
const ulDOM: DOMOutputSpec = ['ul', 0];
const liDOM: DOMOutputSpec = ['li', 0];
const emDOM: DOMOutputSpec = ['em', 0];
const strongDOM: DOMOutputSpec = ['strong', 0];

/**
 * Mark specifications for the schema.
 */
export const marks: { [key: string]: MarkSpec } = {
	link: {
		attrs: {
			href: {},
			title: { default: null }
		},
		inclusive: false,
		parseDOM: [
			{
				tag: 'a[href]',
				getAttrs(dom: Element) {
					return {
						href: dom.getAttribute('href'),
						title: dom.getAttribute('title')
					};
				}
			}
		],
		toDOM(node) {
			const { href, title } = node.attrs;
			return ['a', { href, title }, 0];
		}
	},
	em: {
		parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
		toDOM() {
			return emDOM;
		}
	},
	strong: {
		parseDOM: [
			{ tag: 'strong' },
			{
				tag: 'b',
				getAttrs: (node: HTMLElement) => node.style.fontWeight !== 'normal' && null
			},
			{
				style: 'font-weight',
				getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
			}
		],
		toDOM() {
			return strongDOM;
		}
	}
};

/**
 * Schema to represent a single line of plain text.
 */
export const singleLinePlainTextSchema = new Schema({
	nodes: {
		doc: { content: 'text*' },
		text: { inline: true }
	}
});

/**
 * Schema to represent a single line of rich text.
 */
export const singleLineRichTextSchema = new Schema({
	nodes: {
		doc: { content: 'text*' },
		text: { inline: true }
	},
	marks
});

/**
 * Schema to represent multi-line rich text.
 */
export const multiLineRichTextSchema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: {
			content: 'inline*',
			group: 'block',
			parseDOM: [{ tag: 'p' }],
			toDOM() {
				return pDOM;
			}
		},
		ordered_list: {
			content: 'list_item+',
			group: 'block',
			attrs: { order: { default: 1 } },
			parseDOM: [
				{
					tag: 'ol',
					getAttrs(dom: Element) {
						return {
							order: dom.hasAttribute('start') ? +dom.getAttribute('start')! : 1
						};
					}
				}
			],
			toDOM(node) {
				return node.attrs.order === 1 ? olDOM : ['ol', { start: node.attrs.order }, 0];
			}
		},
		bullet_list: {
			content: 'list_item+',
			group: 'block',
			parseDOM: [{ tag: 'ul' }],
			toDOM() {
				return ulDOM;
			}
		},
		list_item: {
			content: 'paragraph+',
			parseDOM: [{ tag: 'li' }],
			toDOM() {
				return liDOM;
			},
			defining: true
		},
		blockquote: {
			content: 'paragraph+',
			group: 'block',
			defining: true,
			parseDOM: [{ tag: 'blockquote' }],
			toDOM() {
				return blockquoteDOM;
			}
		},
		heading: {
			attrs: { level: { default: 1 } },
			content: 'inline*',
			marks: '',
			group: 'block',
			defining: true,
			parseDOM: [
				{
					tag: 'h2',
					getAttrs() {
						return { level: 1 };
					}
				},
				{
					tag: 'h3',
					getAttrs() {
						return { level: 2 };
					}
				},
				{
					tag: 'h4',
					getAttrs() {
						return { level: 3 };
					}
				}
			],
			toDOM(node) {
				return ['h' + (parseInt(node.attrs.level) + 1), {}, 0];
			}
		},
		text: {
			group: 'inline'
		},
		image: {
			attrs: {
				src: {},
				width: {},
				height: {}
			},
			group: 'block',
			draggable: true,
			parseDOM: [
				{
					tag: 'img',
					getAttrs(dom: Element) {
						return {
							src: dom.getAttribute('src'),
							width: dom.getAttribute('width'),
							height: dom.getAttribute('height')
						};
					}
				}
			],
			toDOM(node) {
				const { src, width, height } = node.attrs;
				return ['img', { src, width, height }];
			}
		},
		hard_break: {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM() {
				return brDOM;
			}
		}
	},
	marks
});

/**
 * Schema to represent multi-line plain text.
 */
export const multiLinePlainTextSchema = new Schema({
	nodes: {
		doc: { content: 'block+' },
		paragraph: {
			content: 'inline*',
			group: 'block',
			parseDOM: [{ tag: 'p' }],
			toDOM() {
				return pDOM;
			}
		},
		text: {
			group: 'inline'
		},
		hard_break: {
			inline: true,
			group: 'inline',
			selectable: false,
			parseDOM: [{ tag: 'br' }],
			toDOM() {
				return brDOM;
			}
		}
	}
});
