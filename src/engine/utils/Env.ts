
// Static equivalent of process.env
/* 
*/

import { getProcessPath } from "./Runtime";

export class InherentConfig {
	private singleton: InherentConfig | null = null;
	node_env = process.env.NODE_ENV || "development";
	constructor() {
		if (this.singleton) return this.singleton;
		this.singleton = this;
		return this.singleton;
	}
	static get node_env() {
		return new InherentConfig().node_env;
	}
}

export class PackageJSON {
	private singleton: PackageJSON | null = null;
	name?: string;
	version?: string;
	description?: string;
	main?: string;
	author?: string;
	license?: string;
	homepage?: string;
	type?: string;
	repository?: {
		type: string;
		url: string;
	};
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	bugs?: {
		url: string;
	};
	engines?: {
		node: string;
	};
	scripts?: Record<string, string>;
	constructor() {
		if (this.singleton) return this.singleton;
		const packageJSON = require(`${getProcessPath()}/package.json`);
		this.name = packageJSON.name;
		this.version = packageJSON.version;
		this.description = packageJSON.description;
		this.main = packageJSON.main;
		this.author = packageJSON.author;
		this.license = packageJSON.license;
		this.homepage = packageJSON.homepage;
		this.type = packageJSON.type;
		this.repository = packageJSON.repository;
		this.dependencies = packageJSON.dependencies;
		this.devDependencies = packageJSON.devDependencies;
		this.bugs = packageJSON.bugs;
		this.engines = packageJSON.engines;
		this.scripts = packageJSON.scripts;

		this.singleton = this;
		return this.singleton;
	}
}