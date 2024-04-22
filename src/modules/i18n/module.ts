import I18nConfig from "@src/config/modules/i18n";
import Module from "@src/engine/modules";
import { debug } from "@src/engine/utils/Logger";
import { getProcessPath } from "@src/engine/utils/Runtime";
import { EventEmitter } from "events";
import i18next, { i18n, TFunction } from "i18next";
import Backend, { FsBackendOptions } from 'i18next-fs-backend';
import path from "path";

const ReboundEvents = [
	"initialized",
	"languageChanged",
	"loaded",
	"failedLoading",
	"missingKey",
] as const


export class I18nModule extends EventEmitter {
	private i18n: i18n
	private fixedTranslators: Map<string, TFunction> = new Map()
	constructor() {
		super()

		this.i18n = i18next.createInstance()
		for (const event of ReboundEvents) {
			this.i18n.on(event, (...args) => {
				this.emit(event, ...args)
			})
		}
	}
	async initialize(config: I18nConfig) {
		await this.i18n
			.use(Backend)
			.init<FsBackendOptions>({
				fallbackLng: config.baseLanguage,
				ns: ["default"],
				defaultNS: "default",
				backend: {
					loadPath: path.join(getProcessPath(), "/lang/{{lng}}/{{ns}}.json"),
					addPath: path.join(getProcessPath(), "/lang/{{lng}}/{{ns}}.missing.json"),
				}
			})
	}
	translateTo(key: string, lang: string, opts?: any) {
		let translator = this.fixedTranslators.get(lang)
		if (!translator) {
			translator = this.i18n.getFixedT(lang)
			this.fixedTranslators.set(lang, translator)
		}
		return translator(key, opts)
	}
	t(key: string, opts?: any) {
		return this.i18n.t(key, opts)
	}
}