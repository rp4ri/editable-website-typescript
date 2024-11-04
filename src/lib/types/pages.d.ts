export interface ImprintPage {
	title: string;
	imprint: string;
	price?: string;
}

export interface BlogPage {
	title: string;
	content: string;
	teaser?: string;
}

export type PageEditor = ImprintPage | BlogPage;
