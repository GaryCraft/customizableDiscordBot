import { ApplicationCommand, ApplicationCommandDataResolvable, ApplicationCommandType, Guild } from "discord.js";
import ExtendedClient, { DSInteraction } from "../../extendedclient";
import { error, info } from "@src/engine/utils/Logger";

function fromInteraction(interaction: DSInteraction): ApplicationCommandDataResolvable {
	const type = interaction.type;

	let data: ApplicationCommandDataResolvable | null = null;
	if (type === "chat")
		data = {
			type: ApplicationCommandType.ChatInput,
			name: interaction.name.toLowerCase().replaceAll(/ /g, "_"),
			description: interaction.description.slice(0, 100),
			options: interaction.options,
		};
	else if (type === "message")
		data = {
			type: ApplicationCommandType.Message,
			name: interaction.name,
		};
	else if (type === "user")
		data = {
			type: ApplicationCommandType.User,
			name: interaction.name,
		};
	if (data === null) throw new Error("Couldn't convert Interaction to ApplicationCommandDataResolvable");
	// If name trim to 32 characters
	if (data.name.length > 32) data.name = data.name.slice(0, 32);
	return data;
}

export default async function updateInteractions(client: ExtendedClient, params: { guild?: Guild } | undefined) {
	const guild = params?.guild;
	if (!guild) {
		const arr: ApplicationCommandDataResolvable[] = [];
		for await (const [, interaction] of client.interactions.entries()) {
			if (interaction.type == "modal") continue;
			if (interaction.registerTo == "app") arr.push(fromInteraction(interaction));
		}
		client.application?.commands.set(arr).catch((e) => {
			error("Error while updating App Interactions: ", e);
		});
		info("Updated App Interactions");
		return;
	}
	const arr: ApplicationCommandDataResolvable[] = [];
	for await (const [, interaction] of client.interactions.entries()) {
		if (interaction.type == "modal") continue;
		if (interaction.registerTo == "guild") arr.push(fromInteraction(interaction));
	}
	await guild.commands.set(arr).catch((e) => {
		error("Found Guild but couldn't Update Interactions", arr, e);
	});
	info("Updated Interactions for", guild.name);
}