import EventEmitter from "events";
import { Parseable, ValidateProperty } from "parzival";
import { GlobalConfig } from "../utils/Configuration";
import ModuleConfigs from "@src/config/modules";
import { getAppContext } from "../utils/Composable";
import { error } from "../utils/Logger";

@Parseable()
class ModulePaths {
	@ValidateProperty({
		type: "string",
		optional: true,
	})
	hooks?: string;

	@ValidateProperty({
		type: "string",
		optional: true,
	})
	commands?: string;

	@ValidateProperty({
		type: "string",
		optional: true,
	})
	tasks?: string;

	@ValidateProperty({
		type: "string",
		optional: true,
	})
	routes?: string;
}

@Parseable()
export default class Module<CTX extends EventEmitter, CFGKey extends keyof ModuleConfigs> {
	@ValidateProperty({
		type: "string",
	})
	name!: CFGKey;

	@ValidateProperty({
		type: "object",
		recurse: true,
		className: "ModulePaths",
		optional: true,
	})
	paths?: ModulePaths;

	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false,
	})
	loadFunction!: (
		config: GlobalConfig["modules"][CFGKey]
	) => Promise<CTX>;

	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false,
	})
	initFunction!: (
		ctx: CTX,
		config: GlobalConfig["modules"][CFGKey]
	) => Promise<void>;
}

export class ModuleManager {
	readonly modules: Map<string, {
		module: Module<any, any>,
		ctx: any,
	}>;
	constructor() {
		this.modules = new Map();
	}
}

export function getModule<CTX extends EventEmitter>(name: keyof ModuleConfigs): CTX | undefined {
	const modman = getAppContext().modman;
	const mod = modman.modules.get(name);
	if (!mod) {
		error("Module not found", name)
		return undefined;
	}
	return mod.ctx as CTX;
}