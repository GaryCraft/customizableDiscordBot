import { ApplicationContext } from "@src/engine/types/Engine";
import { getConfigProperty } from "@src/engine/utils/Configuration";
import { debug, info } from "@src/engine/utils/Logger";

export default async function(appCtx: ApplicationContext) {
	debug("Calling Initializer functions for modules");
	appCtx.modman.modules.forEach(async (m) => {
		debug(`Initializing module ${m.module.name}`);
		await m.module.initFunction(m.ctx, getConfigProperty(`modules.${m.module.name}`));
	});
	info(`Initialized ${appCtx.modman.modules.size} modules`);
}