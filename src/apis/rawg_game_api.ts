import LanguageDetect from "languagedetect";

import { Game } from "@models/game.model";
import { api_get, BaseGameAPI } from "@apis/base_api";
import { RAWGGameResponse, Result } from "./models/rawg_game_response";

const language_detector = new LanguageDetect();

export class RAWGGameAPI implements BaseGameAPI {
	constructor(
		private readonly api_key?: string,
		private readonly search_precise?: boolean,
		private readonly search_exact?: boolean,
	) {}

	async get_by_query(query: string) {
		try {
			const search_results = await api_get<RAWGGameResponse>("https://api.rawg.io/api/games", {
				search: query,
				key: this.api_key,
				search_precise: this.search_precise,
				search_exact: this.search_exact,
			});
			if (!search_results?.count) return [];
			console.log(search_results);
			return search_results.results.map(result => this.create_game_from_(result));
		} catch (error) {
			console.warn(error);
			throw error;
		}
	}

	get_language_by_(query: string): string {
		const detected_languages = language_detector.detect(query, 3);

		if (detected_languages.length) return detected_languages[0][0].slice(0, 2);
		return window.moment.locale() || "en";
	}

	create_game_from_(result: Result): Game {
		const game: Game = {
			name: result.name,
			released: result.released,
			background_image: result.background_image,
			rating: result.rating,
			parent_platforms: result.parent_platforms?.map(platform => platform.platform.name),
			genres: result.genres?.map(genre => genre.name),
			stores: result.stores?.map(store => store.store.name),
			clip: result.clip?.clip || "-",
			tags: result.tags?.map(tag => tag.name),
			short_screenshots: result.short_screenshots?.slice(1, -1)?.map(screenshot => screenshot.image),
		};
		return game;
	}
}
