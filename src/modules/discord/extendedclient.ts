import { useImporterRecursive } from "@src/engine/utils/Importing";
import { warn } from "@src/engine/utils/Logger";
import { getModulePath } from "@src/engine/utils/Runtime";
import { ChatInputCommandInteraction, Client, ClientOptions, Interaction, Message } from "discord.js";
import { Parseable, ValidateProperty, objectSchemaFrom, validateObject } from "parzival";

@Parseable()
export class DSCommand {
	@ValidateProperty({
		type: "string"
	})
	name!: string;
	@ValidateProperty({
		type: "string"
	})
	description!: string;
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	execute!: (client: ExtendedClient, message: Message, args: string[]) => void;
}

@Parseable()
export class DSInteraction<T extends Interaction> {
	@ValidateProperty({
		type: "string"
	})
	name!: string;
	@ValidateProperty({
		type: "string"
	})
	description!: string;
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	execute!: (
		client: ExtendedClient,
		message: T,
	) => void;
}

export default class ExtendedClient extends Client {
	commands: Map<string, DSCommand>;
	interactions: Map<string, DSInteraction<Interaction>>;
	constructor(opts: ClientOptions) {
		super(opts);
		this.commands = new Map();
		this.interactions = new Map();
		const commandSchema = objectSchemaFrom(DSCommand);
		useImporterRecursive(`${getModulePath("discord")}/commands`,
			function validator(i: any, f, d): i is { default: DSCommand } {
				if (!i?.default) {
					warn(`Command ${f} from ${d} has no default export`);
					return false;
				}
				if (!validateObject(i.default, commandSchema)) {
					warn(`Command ${f} from ${d} is invalid`);
					return false;
				}
				return true;
			},
			async (i, f, d) => {
				this.commands.set(i.default.name, i.default);
			});
		const interactionSchema = objectSchemaFrom(DSInteraction);
		useImporterRecursive(`${getModulePath("discord")}/interactions`,
			function validator(i: any, f, d): i is { default: DSInteraction<Interaction> } {
				if (!i?.default) {
					warn(`Interaction ${f} from ${d} has no default export`);
					return false;
				}
				if (!validateObject(i.default, interactionSchema)) {
					warn(`Interaction ${f} from ${d} is invalid`);
					return false;
				}
				return true;
			},
			async (i, f, d) => {
				this.interactions.set(i.default.name, i.default);
			});
	}
}