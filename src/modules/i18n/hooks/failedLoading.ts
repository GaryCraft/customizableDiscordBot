import { debug, warn } from "@src/engine/utils/Logger";
import { I18nModule } from "../module";

export default async (i18n: I18nModule, lng: string, ns: string, msg: string) => {
	warn("Failed to load translation file", { lng, ns, msg });
};