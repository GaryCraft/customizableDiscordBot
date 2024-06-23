import path from 'path';
import child_process from 'child_process';

// PackageJSON
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


export const getPackageJSON = () => {
	return new PackageJSON();
};


// Paths
export const getProcessPath = () => {
	return process.cwd();
};

export const getRootPath = () => {
	const processPath = getProcessPath();
	return isRunningAsCompiled() ? path.join(processPath, 'dist') : path.join(processPath, 'src');
};

export const getRunningFileExtension = () => {
	const thisFilename = __filename;
	const lastDot = thisFilename.lastIndexOf('.');
	return thisFilename.slice(lastDot + 1);
};

export const isRunningAsCompiled = () => {
	return getRunningFileExtension() === 'js';
};

export const getWebPublicDir = () => {
	return path.join(getProcessPath(), '/public');
};

export const getModulePath = (module: string) => {
	return path.join(getRootPath(), '/modules', module);
};

export const getTempPath = () => {
	return path.join(getProcessPath(), '/temp');
}

// Execution

export const isWindows = () => {
	return process.platform === 'win32';
}

export const hasBash = () => {
	return !isWindows();
}

export const spawnBash = (command: string, args: string[]) => {
	if (!hasBash()) {
		throw new Error('Bash is not available on this system.');
	}
	return child_process.spawn(command, args);
}

