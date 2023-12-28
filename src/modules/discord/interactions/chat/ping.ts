import { ChatInputCommandInteraction } from "discord.js";
import { DSInteraction } from "../../extendedclient";

export default {
	name: "ping",
	description: "Ping!",
	async execute(client, interaction) {
		interaction.reply("Pong!");
	},
} satisfies DSInteraction<ChatInputCommandInteraction>;