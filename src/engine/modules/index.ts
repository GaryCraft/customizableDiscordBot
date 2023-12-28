import EventEmitter from "events";
import { Parseable, ValidateProperty } from "parzival";
import { GlobalConfig } from "../utils/Configuration";
import ModuleConfigs from "@src/config/modules";

@Parseable()
export default class Module<CTX extends EventEmitter, CFGKey extends keyof ModuleConfigs> {
	@ValidateProperty({
		type: "string",
	})
	name!: CFGKey;

	@ValidateProperty({
		type: "string",
	})
	hooksInnerPath!: string;

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