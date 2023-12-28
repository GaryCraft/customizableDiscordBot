import fs from "fs";
import Module from "@src/engine/modules";
import { ApplicationContext } from "@src/engine/types/Engine";
import { debug, info, warn } from "@src/engine/utils/Logger";
import { getRootPath, isRunningAsCompiled } from "@src/engine/utils/Runtime";
import { objectSchemaFrom, validateObject } from "parzival";
import { getConfigProperty } from "@src/engine/utils/Configuration";
import { useImporterRecursive } from "@src/engine/utils/Importing";
import { HookExecutor } from "@src/engine/types/Executors";
import { EventEmitter } from "events";

export default async function (appCtx: ApplicationContext) {
	debug("Loading modules");
	const fsdirs = fs.readdirSync(`${getRootPath()}/modules`);
	const moduleSchema = objectSchemaFrom(Module);
	for (const fsdir of fsdirs) {
		if (fs.statSync(`${getRootPath()}/modules/${fsdir}`).isDirectory()) {
			debug(`Loading module ${fsdir}`);
			const module = (await import(`${getRootPath()}/modules/${fsdir}/index${isRunningAsCompiled() ? ".js" : ".ts"}`)).default;
			if (!validateObject(module.default, moduleSchema)) {
				throw new Error(`Module ${fsdir} is invalid`);
			}
			const config = getConfigProperty(`modules.${fsdir}`);
			const moduleLoaded = await module.default.loadFunction(config);
			debug(`Loaded module context for ${fsdir}`);
			appCtx.modman.modules.set(fsdir, {
				module: module.default,
				ctx: moduleLoaded,
			});
			debug(`Loading Module Hooks for ${fsdir}`);
			await useImporterRecursive(`${getRootPath()}/modules/${fsdir}/${module.default.hooksInnerPath}`,
				function validator(hookModule: any, file, dir): hookModule is { default: HookExecutor } {
					if (!hookModule?.default) {
						warn(`Hook ${file} from ${dir} has no default export`);
						return false;
					}
					if (typeof hookModule.default !== "function") {
						warn(`Hook ${file} from ${dir} is invalid`);
						return false;
					}
					return true;
				},
				function loader(hookModule, file, dir) {
					const hookName = file.slice(0, -3).replaceAll(".", ":");
					const namespacedName = `modules:${fsdir}:${hookName}`;
					debug(`Binding hook ${namespacedName}`);
					appCtx.events.on(
						namespacedName,
						hookModule.default.bind(null, moduleLoaded)
					);
					debug(`Propagating hook ${namespacedName}`);
					appCtx.events.listenTo(appCtx.modman.modules.get(fsdir)!.ctx, {
						[hookName]: namespacedName,
					});
				});
		}
	}
	info(`Loaded ${appCtx.modman.modules.size} modules`);
}