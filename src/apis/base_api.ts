import { requestUrl } from "obsidian";
import { Game } from "@models/game.model";
import { ServiceProvider } from "@src/constants";
import { GameSearchPluginSettings } from "@settings/settings";
import { RAWGGameAPI } from "./rawg_game_api";

export interface BaseGameAPI {
	get_by_query(query: string): Promise<Game[]>;
}

export function get_service_provider(settings: GameSearchPluginSettings): BaseGameAPI {
	if (settings.service_provider === ServiceProvider.rawg) {
		if (!settings.api_key) throw new Error("RAWG API key is required!");
		return new RAWGGameAPI(settings.api_key, settings.search_precise, settings.search_exact);
	}
}

export async function api_get<T>(
	url: string,
	params: Record<string, string | number | boolean> = {},
	headers?: Record<string, string>,
): Promise<T> {
	const api_url = new URL(url);
	Object.entries(params).forEach(([key, value]) => {
		api_url.searchParams.append(key, value?.toString());
	});
	const result = await requestUrl({
		url: api_url.href,
		method: "GET",
		headers: {
			Accept: "*/*",
			"Content-Type": "application/json; charset=utf-8",
			...headers,
		},
	});
	return result.json as T;
}
