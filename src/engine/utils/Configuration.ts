import { objectSchemaFrom, validateObject } from "parzival";
import { getProcessPath } from "@src/engine/utils/Runtime";
import DefGlobalConfig from "@src/config";
import { Result } from "@src/engine/utils/ActualUtils";
import { debug, warn } from "./Logger";
import { InherentConfig } from "./Env";
export type GlobalConfig = DefGlobalConfig & InherentConfig;
let cachedConfig: GlobalConfig | null = null;

const mergeConfig = (config: DefGlobalConfig): GlobalConfig => {
	const inherentConfig = new InherentConfig();
	const mergedConfig = Object.assign(inherentConfig, config);
	return mergedConfig;
}

const loadConfig = (): Result<GlobalConfig, Error> => {
	const path = getProcessPath();
	const configObject = require(`${path}/config`);
	debug("Loaded configuration file.", configObject);
	const schema = objectSchemaFrom(DefGlobalConfig);
	const isValid = validateObject(configObject, schema);
	if (!isValid) return new Error("Invalid configuration file.");
	cachedConfig = mergeConfig(configObject);
	return Object.freeze(configObject);
};

export const getConfig = (): GlobalConfig => {
	if (!cachedConfig) {
		const result = loadConfig();
		if (result instanceof Error) throw result;
		return result;
	}
	return cachedConfig;
};

export const reloadConfig = (): Result<GlobalConfig, Error> => {
	const result = loadConfig();
	if (result instanceof Error) return result;
	return result;
};

export const getConfigValue = <T extends keyof GlobalConfig>(key: T): GlobalConfig[T] | null => {
	if (!cachedConfig) return null;
	return cachedConfig[key];
};

// Pathed version of getConfigValue separated by dots
export const getConfigProperty = <T>(cfgPath: string): T | null => {
	if (!cachedConfig) return null;
	const path = cfgPath.split(".");
	let current: any = cachedConfig;
	for (const key of path) {
		if (current[key] === undefined || current[key] === null) {
			warn(`Config property ${key} not found in ${cfgPath}`);
			return null;
		}
		current = current[key];
	}
	return current;
}