export interface RAWGGameResponse {
	count: number;
	next: string;
	previous: string;
	results: Result[];
}

export interface Result {
	name: string;
	released: string;
	background_image: string;
	rating: number;
	parent_platforms: ParentPlatform[];
	genres: Genre[];
	stores: ParentStore[];
	clip: Clip;
	tags: Tag[];
	short_screenshots: ShortScreenshot[];
}

export interface ParentPlatform {
	platform: Platform;
}

export interface Platform {
	id: number;
	name: string;
	slug: string;
}

export interface Genre {
	id: number;
	name: string;
	slug: string;
}

export interface ParentStore {
	store: Store;
}

export interface Store {
	id: number;
	name: string;
	slug: string;
}

export interface Clip {
	clip: string;
}

export interface Tag {
	id: number;
	name: string;
	slug: string;
	language: string;
}

export interface ShortScreenshot {
	id: number;
	image: string;
}
