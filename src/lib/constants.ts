export interface Shortcut {
  name: string;
  url: string;
}

export const SHORTCUTS: Shortcut[] = [
  { name: 'About', url: '/' },
  { name: 'Blog', url: '/blog' },
  { name: 'Contact', url: '/#contact' },
  { name: 'Imprint', url: '/imprint' },
  { name: 'Login', url: '/login' },
];