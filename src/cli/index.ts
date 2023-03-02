import Bot from "../clients/Discord";
import readline from "readline";
import findRecursive from "@spaceproject/findrecursive";
import { CliCommand } from "@src/types/AppExecutors";
import { App } from "@src/app";
class CLI {
	app: App;
	private input : NodeJS.ReadableStream;
	private output : NodeJS.WritableStream;
	private interface :readline.Interface;
	readonly commands = new Map<string, CliCommand>();
	constructor(app: App, output: NodeJS.WritableStream, input: NodeJS.ReadableStream) {
		this.app = app;
		this.input = input;
		this.output = output;
		this.interface = readline.createInterface({
			input: this.input,
			output: this.output,
			prompt: "> "
		});
		this.init();
	}
	async loadCommands() {
		const commands = await findRecursive(`${__dirname}/commands`);
		for (const [command,dir] of commands) {
			const cmd:{default:CliCommand} = await import(`${dir}/${command}`);
			if (!cmd.default) continue;
			this.commands.set(cmd.default.name, cmd.default);
		}
	}
	async init() {
		await this.loadCommands();
		this.interface.on("line", (line) => {
			const args = line.trim().split(/ +/g);
			const command = args.shift();
			if (!command) return;
			try {
				this.commands.get(command)?.execute(this.app, args);
			} catch (error) {
				console.log(error);
			}
		});
	}
}
export default CLI;