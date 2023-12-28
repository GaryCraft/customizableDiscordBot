import { Interaction } from "discord.js";
import ExtendedClient from "../../extendedclient";
import { error, warn } from "@src/engine/utils/Logger";


export default async (client: ExtendedClient, interaction:Interaction) => {
	
	if(interaction.isButton()) return client.emit(interaction.customId.split("|")[0], {interaction});

	let inter = null;
	if(interaction.isAnySelectMenu()) {
		inter = client.interactions.get(interaction.customId.split("|")[0]);
		if (!inter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Menu ${interaction.customId}`);
	}
	if(interaction.isChatInputCommand() || interaction.isContextMenuCommand()){
		inter = client.interactions.get(interaction.commandName.replace(/\s/g, "_"));
		if (!inter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Command ${interaction.commandName}`);
	}
	if(interaction.isModalSubmit()) {
		inter = client.interactions.get(interaction.customId.split("|")[0]);
		if (!inter) warn(`${client.shard?.ids[0] ?? "Discord Client"}`, `No interaction found for Modal ${interaction.customId}`);
	}
	if(!inter) return;
	try{
		await inter.execute(client, interaction);
	}catch(e){
		error(`${client.shard?.ids[0] ?? "Discord Client"}`, "", e);
	}
};
