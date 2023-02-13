import { AnySelectMenuInteraction, ApplicationCommandOption, ApplicationCommandType, CommandInteraction, Message, ModalSubmitInteraction } from "discord.js";
import Bot from "../clients/Discord";

interface Command {
	name: string;
	aliases: string[];
	description: string;
	category: string;
	usage: string;
	execute(client:Bot, message:Message, args:string[]): Promise<unknown>;
}
interface Interaction {
	type: ApplicationCommandType | "SubFunction";
	name: string;
	description: string;
	category: string;
	internal_category: "app" | "guild" | "sub";
	options?: ApplicationCommandOption[];
	execute<T = CommandInteraction>(client: Bot, interaction: T):Promise<unknown>;
	execute<T = AnySelectMenuInteraction>(client: Bot, interaction: T):Promise<unknown>;
	execute<T = ModalSubmitInteraction>(client: Bot, interaction: T):Promise<unknown>;
}

type EventExecutor<T> = (client: Bot, params:T) => Promise<unknown>;

interface Job {
	name: string;
	cronInterval: string;
	task: (client:Bot) => Promise<unknown>;
}
interface CliCommand {
	name: string;
	description: string;
	usage: string;
	execute(client:Bot, args:string[]): Promise<unknown>;
}

export { Command, Interaction, EventExecutor, Job, CliCommand };