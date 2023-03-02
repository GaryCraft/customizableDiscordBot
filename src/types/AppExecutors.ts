import { App } from "@src/app";

interface CliCommand {
	name: string;
	description: string;
	usage: string;
	execute(app: App, args: string[]): Promise<unknown>;
}
export { CliCommand };