import { ApplicationContext } from "@src/engine/types/Engine";
import { getConfigProperty } from "@src/engine/utils/Configuration";
import { debug, info } from "@src/engine/utils/Logger";

export default async function(appCtx: ApplicationContext) {
	debug("Initializing HTTP server");
	appCtx.http.server.listen(getConfigProperty("http.port") || 3000, () => {
		info(`HTTP server listening on port ${getConfigProperty("http.port") || 3000}`);
	});
	appCtx.http.websockets.listen(getConfigProperty("http.wsPort") || 3001);
	info(`WebSocket server listening on port ${getConfigProperty("http.wsPort") || 3001}`);
}