import { writable } from 'svelte/store';
import type { CurrentUser } from './types/user';

import type { EditorView } from 'prosemirror-view';

export const activeEditorView = writable<EditorView | null>(null);
export const isEditing = writable<boolean>(false);
export const currentUser = writable<CurrentUser | null>(null);
