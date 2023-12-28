import { ApplicationContext } from "@src/engine/types/Engine";
import { HTTPRouteHandler } from "@src/engine/types/Executors";
import { useImporterRecursive } from "@src/engine/utils/Importing";
import { debug, info, warn } from "@src/engine/utils/Logger";
import { getRootPath } from "@src/engine/utils/Runtime";
import { objectSchemaFrom, validateObject } from "parzival";

export default async function(appCtx: ApplicationContext) {
	const validationSchema = objectSchemaFrom(HTTPRouteHandler);
	debug("Loading routes...");
	await useImporterRecursive(`${getRootPath()}/routes`,
		function validator(routeFile: any, file, dir): routeFile is { default: HTTPRouteHandler } {
			if (!routeFile?.default) {
				warn(`Route ${file} from ${dir} has no default export`);
				return false;
			}
			if (!validateObject(routeFile.default, validationSchema)) {
				warn(`Route ${file} from ${dir} is invalid`);
				return false;
			}
			return true;
		},
		function loader(routeModule, file, dir) {
			const parsedRoute = `${dir.replace(getRootPath() + "/routes", "")}/${file.split(".")[0]}`.replace(/\$/g, ":");
			debug(`Registering route ${file} as ${parsedRoute}`);
			const IRoute = appCtx.http.server.route(parsedRoute);
			const route = routeModule.default;
			if (route.get) IRoute.get(route.get);
			if (route.post) IRoute.post(route.post);
			if (route.put) IRoute.put(route.put);
			if (route.delete) IRoute.delete(route.delete);
			if (route.patch) IRoute.options(route.patch);
		});
	info("Finished loading routes");
}