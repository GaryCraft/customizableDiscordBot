import { ApplicationCommandDataResolvable, Guild } from "discord.js";
import ExtendedClient, { DSInteraction } from "../../extendedclient";
import { error, info } from "@src/engine/utils/Logger";
interface CleanInteraction {
	name: string;
	description?: string;
	registerTo?: DSInteraction["registerTo"];
}

export default async function updateInteractions(client: ExtendedClient, params: { guild?: Guild } | undefined) {
	const guild = params?.guild;
	if (!guild) {
		const arr: ApplicationCommandDataResolvable[] = [];
		for await (const [, interaction] of client.interactions.entries()) {
			const cleanInt: CleanInteraction = {
				name: interaction.name,
				registerTo: interaction.registerTo,
			}
			cleanInt.description = interaction.type == "chat" ? undefined : interaction.description;
		}
		client.application?.commands.set(arr).catch((e) => {
			error("Error while updating App Interactions: ", e);
		});
		info("Updated App Interactions");
		return;
	}
	const arr = [];
	for await (const [, interaction] of client.interactions.entries()) {
		const cleanInt: CleanInteraction = {
			name: interaction.name,
			registerTo: interaction.registerTo,
		}
		cleanInt.description = interaction.type == "chat" ? undefined : interaction.description;
		if (cleanInt.registerTo == "guild") arr.push(cleanInt);
	}
	await guild.commands.set(arr as ApplicationCommandDataResolvable[]).catch((e) => {
		error("Found Guild but couldn't Update Interactions", e);
	});
	info("Updated Interactions for", guild.name);
}