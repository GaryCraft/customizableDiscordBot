import { Interaction } from "discord.js";
import ExtendedClient, { DSInteraction } from "../../extendedclient";
import { error, warn } from "@src/engine/utils/Logger";


export default async (client: ExtendedClient, interaction: Interaction) => {

	if (interaction.isButton()) return client.emit(interaction.customId.split("|")[0], { interaction });

	let execInter: DSInteraction | undefined;
	if (interaction.isAnySelectMenu()) {
		execInter = client.interactions.get(interaction.customId.split("|")[0]);
		if (!execInter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Menu ${interaction.customId}`);
	}
	if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
		execInter = client.interactions.get(interaction.commandName.replace(/\s/g, "_"));
		if (!execInter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Command ${interaction.commandName}`);
	}
	if (interaction.isModalSubmit()) {
		execInter = client.interactions.get(interaction.customId.split("|")[0]);
		if (!execInter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Modal ${interaction.customId}`);
	}
	if (!execInter) return;
	try {
		// @ts-expect-error Interaction should be still a valid type, but got reduced to never because conflicting ApplicationCommandTypes
		await execInter.execute(client, interaction);
	} catch (e) {
		error(`${client.shard?.ids[0] ?? "Discord Client"}`, "", e);
	}
};
