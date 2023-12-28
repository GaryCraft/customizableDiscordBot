import path from 'path';
import { PackageJSON } from './Env';
export const getProcessPath = () => {
	return process.cwd();
}

export const getRootPath = () => {
	const processPath = getProcessPath();
	return isRunningAsCompiled() ? path.join(processPath, 'dist') : path.join(processPath, 'src');
}

export const getRunningFileExtension = () => {
	const thisFilename = __filename;
	const lastDot = thisFilename.lastIndexOf('.');
	return thisFilename.slice(lastDot + 1);
}

export const isRunningAsCompiled = () => {
	return getRunningFileExtension() === 'js';
}

export const getPackageJSON = () => {
	return new PackageJSON();
}

export const getWebPublicDir = () => {
	return path.join(getRootPath(), '/public');
}

export const getModulePath = (module: string) => {
	return path.join(getRootPath(), '/modules', module);
}