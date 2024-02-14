import { App, SuggestModal } from "obsidian";
import { Game } from "@models/game.model";

export class GameSuggestModal extends SuggestModal<Game> {
	constructor(
		app: App,
		private readonly suggestion: Game[],
		private onChoose: (error: Error | null, result?: Game) => void,
	) {
		super(app);
	}

	getSuggestions(query: string): Game[] {
		return this.suggestion.filter(game => {
			const search_query = query?.toLowerCase();
			return (
				game.name?.toLowerCase().includes(search_query) ||
				game.released?.toLowerCase().includes(search_query) ||
				game.genres?.join(", ").toLowerCase().includes(search_query)
			);
		});
	}

	renderSuggestion(game: Game, element: HTMLElement) {
		element.createEl("div", { text: game.name });

		const released = game.released || "-";
		const genres = game.genres?.join(", ") || "-";

		element.createEl("small", { text: `${genres} (${released})` });
	}

	onChooseSuggestion(game: Game) {
		this.onChoose(null, game);
	}
}
