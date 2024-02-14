import { ButtonComponent, Modal, Setting, TextComponent, Notice } from "obsidian";
import { Game } from "@models/game.model";
import { BaseGameAPI, get_service_provider } from "@apis/base_api";
import GameSearchPlugin from "@src/main";

export class GameSearchModal extends Modal {
	private isBusy = false;
	private okBtnRef?: ButtonComponent;
	private service_provider: BaseGameAPI;

	constructor(
		plugin: GameSearchPlugin,
		private query: string,
		private callback: (error: Error | null, result?: Game[]) => void,
	) {
		super(plugin.app);
		this.service_provider = get_service_provider(plugin.settings);
	}

	setBusy(busy: boolean) {
		this.isBusy = busy;
		this.okBtnRef?.setDisabled(busy);
		this.okBtnRef?.setButtonText(busy ? "Requesting..." : "Search");
	}

	async search_game() {
		if (!this.query) throw new Error("No query entered.");

		if (!this.isBusy) {
			try {
				this.setBusy(true);
				const searchResults = await this.service_provider.get_by_query(this.query);
				this.setBusy(false);

				if (!searchResults?.length) {
					new Notice(`No results found for "${this.query}"`); // Couldn't find the game.
					return;
				}
				this.callback(null, searchResults);
			} catch (err) {
				this.callback(err as Error);
			}
			this.close();
		}
	}

	submitEnterCallback(event: KeyboardEvent) {
		if (event.key === "Enter" && !event.isComposing) {
			this.search_game();
		}
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl("h2", { text: "Search Game" });

		contentEl.createDiv({ cls: "game-search-plugin__search-modal--input" }, setting_item => {
			new TextComponent(setting_item)
				.setValue(this.query)
				.setPlaceholder("Search by keyword")
				.onChange(value => (this.query = value))
				.inputEl.addEventListener("keydown", this.submitEnterCallback.bind(this));
		});
		new Setting(contentEl).addButton(btn => {
			return (this.okBtnRef = btn
				.setButtonText("Search")
				.setCta()
				.onClick(() => {
					this.search_game();
				}));
		});
	}

	onClose() {
		this.contentEl.empty();
	}
}
