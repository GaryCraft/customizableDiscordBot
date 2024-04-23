import { debug, warn } from "@src/engine/utils/Logger";
import { I18nModule } from "../module";

export default async (i18n: I18nModule, lngs: string[], ns: string, msg: string) => {
	warn("Missing key in translation file", { lngs, ns, msg });
};