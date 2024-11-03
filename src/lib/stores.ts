import { writable } from 'svelte/store';
import type { CurrentUser } from './types/user';

export const activeEditorView = writable(null);
export const isEditing = writable(false);
export const currentUser = writable<CurrentUser | null>(null);
