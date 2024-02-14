export interface Frontmatter {
	[key: string]: string | string[];
}

export interface Game {
	name: string;
	released: string;
	background_image: string;
	rating: number;
	parent_platforms: string[];
	genres: string[];
	stores: string[];
	clip: string;
	tags: string[];
	short_screenshots: string[];
}
