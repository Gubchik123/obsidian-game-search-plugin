import { App, PluginSettingTab, Setting } from "obsidian";

import { ServiceProvider } from "@src/constants";

import GameSearchPlugin from "../main";

import { FileSuggest } from "./suggesters/FileSuggester";
import { FolderSuggest } from "./suggesters/FolderSuggester";

export enum DefaultFrontmatterKeyType {
	snake_case = "Snake Case",
	camel_case = "Camel Case",
}

export interface GameSearchPluginSettings {
	folder: string; // new file location
	template_file: string;
	open_page_on_completion: boolean;
	service_provider: ServiceProvider;
	api_key: string;
	search_precise: boolean;
	search_exact: boolean;
	// Default settings
	frontmatter: string; // frontmatter that is inserted into the file
	content: string; // what is automatically written to the file.
	use_default_frontmatter: boolean;
	default_frontmatter_key_type: DefaultFrontmatterKeyType;
}

export const DEFAULT_SETTINGS: GameSearchPluginSettings = {
	folder: "",
	template_file: "",
	open_page_on_completion: true,
	service_provider: ServiceProvider.rawg,
	api_key: "",
	search_precise: true,
	search_exact: false,
	// Default settings
	frontmatter: "",
	content: "",
	use_default_frontmatter: true,
	default_frontmatter_key_type: DefaultFrontmatterKeyType.snake_case,
};

export class GameSearchSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: GameSearchPlugin) {
		super(app, plugin);
	}

	get settings() {
		return this.plugin.settings;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.classList.add("game-search-plugin__settings");
		// General Settings
		new Setting(containerEl)
			.setName("New File Location")
			.setDesc("New game notes will be placed here.")
			.addSearch(cb => {
				try {
					new FolderSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: folder1/folder2")
					.setValue(this.plugin.settings.folder)
					.onChange(new_folder => {
						this.plugin.settings.folder = new_folder;
						this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("Template File")
			.setDesc("Files will be available as templates.")
			.addSearch(cb => {
				try {
					new FileSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder("Example: templates/template-file.md")
					.setValue(this.plugin.settings.template_file)
					.onChange(new_template_file => {
						this.plugin.settings.template_file = new_template_file;
						this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("Open New Game Note")
			.setDesc("Enable or disable the automatic opening of the note on creation.")
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.open_page_on_completion).onChange(async value => {
					this.plugin.settings.open_page_on_completion = value;
					await this.plugin.saveSettings();
				}),
			);
		new Setting(containerEl)
			.setName("Service Provider")
			.setDesc("Choose the service provider you want to use to search your game.")
			.setClass("game-search-plugin__settings--service_provider")
			.addDropdown(dropDown => {
				dropDown.addOption(ServiceProvider.rawg, ServiceProvider.rawg);
				dropDown.setValue(this.plugin.settings?.service_provider ?? ServiceProvider.rawg);
				dropDown.onChange(async value => {
					const new_value = value as ServiceProvider;
					this.settings["service_provider"] = new_value;
					await this.plugin.saveSettings();
				});
			});
		// API Settings
		const APISettings: Setting[] = [];
		APISettings.push(
			new Setting(containerEl)
				.setName("API Key")
				.setDesc("WARNING: It is not 'Bearer' JSON Web Token (JWT).")
				.addText(text => {
					text.inputEl.type = "password";
					text.setValue(this.plugin.settings.api_key).onChange(async value => {
						this.plugin.settings.api_key = value;
						await this.plugin.saveSettings();
					});
				}),
		);
		APISettings.push(
			new Setting(containerEl)
				.setName("Search Precise")
				.setDesc("Enable or disable fuzziness for the search query.")
				.addToggle(toggle =>
					toggle.setValue(this.plugin.settings.search_precise).onChange(async value => {
						this.plugin.settings.search_precise = value;
						await this.plugin.saveSettings();
					}),
				),
		);
		APISettings.push(
			new Setting(containerEl)
				.setName("Search Exact")
				.setDesc("Mark the search query as exact.")
				.addToggle(toggle =>
					toggle.setValue(this.plugin.settings.search_exact).onChange(async value => {
						this.plugin.settings.search_exact = value;
						await this.plugin.saveSettings();
					}),
				),
		);
	}
}
