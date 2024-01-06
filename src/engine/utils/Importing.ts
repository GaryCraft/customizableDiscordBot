import findRecursive from "@spaceproject/findrecursive";
type Validator<T> = (imported: unknown, file: string, dir: string) => imported is T | null;
type Loader<T> = (imported: T, file: string, dir: string) => void;
// Import, Validate and use loader
export async function useImporter<T>(file: string, dir: string, validator: Validator<T>, loader: Loader<T>) {
	const imported = (await import(`${dir}/${file}`)).default;
	const validated = validator(imported, file, dir);
	if (!validated) {
		return null;
	}
	loader(imported as T, file, dir);
	return imported;
}

export async function useImporterRecursive<T>(dir: string, validator: Validator<T>, loader: Loader<T>, middleware?: (file: string, dir: string) => void) {
	const files = await findRecursive(dir);
	for (const [file, dir] of files) {
		if (middleware) {
			middleware(file, dir);
		}
		await useImporter(file, dir, validator, loader);
	}
}