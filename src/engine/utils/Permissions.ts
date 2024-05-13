import fs from 'fs';
import { spawnBash } from './Runtime';

const AccessLevel = {
	NONE: 0,
	READ: 1,
	WRITE: 2,
	EXECUTE: 3
} as const;

type AccessLevel = typeof AccessLevel[keyof typeof AccessLevel];

class Permissions {
	private path: string;
	private perms: {
		owner: AccessLevel,
		group: AccessLevel,
		others: AccessLevel
	};
	constructor(path: string) {
		this.path = path;
		this.perms = getFilePermissions(getFilePermissionsNumber(path));
	}
}

export const isAccessible = (path: string): boolean => {
	try {
		fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
		return true;
	} catch (err) {
		return false;
	}
}

const getFilePermissionsNumber = (path: string) => {
	// check file permissions using bash
	const perms = spawnBash('stat', ['-c', '%a', path]);
	// parse the output
	const permsStr = perms.stdout.toString().trim();
	// convert to number
	return parseInt(permsStr, 8);
}

const intoAccessLevel = (r: number, w: number, e: number) => {
	if (r && w && e) return AccessLevel.EXECUTE;
	if (r && w) return AccessLevel.WRITE;
	if (r) return AccessLevel.READ;
	return AccessLevel.NONE;
}

const getFilePermissions = (perms: number) => {
	const owner = intoAccessLevel(perms & 0o700, perms & 0o070, perms & 0o007);
	const group = intoAccessLevel(perms & 0o070, perms & 0o007, perms & 0o700);
	const others = intoAccessLevel(perms & 0o007, perms & 0o700, perms & 0o070);
	return { owner, group, others };
}

// For a file to be secure only the owner should have read, write, and execute permissions
// The group and others should only have read permissions
// And everyone else should have no permissions
export const isSecure = (path: string): boolean => {
	const perms = getFilePermissions(getFilePermissionsNumber(path));
	return perms.owner === AccessLevel.EXECUTE && perms.group === AccessLevel.READ && perms.others === AccessLevel.NONE;
}