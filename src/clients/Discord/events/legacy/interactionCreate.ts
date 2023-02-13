import { Interaction } from "discord.js";
import Bot from "@src/clients/Discord";

export default async (client: Bot, interaction:Interaction) => {
	
	if(interaction.isButton()) return client.emit(interaction.customId.split("|")[0], {interaction});

	let inter = null;
	if(interaction.isAnySelectMenu()) {
		inter = client.interactions.get(interaction.customId.split("|")[0]);
		if(!inter) client.logger.warn(`No interaction found for Menu ${interaction.customId}`);
	}
	if(interaction.isChatInputCommand() || interaction.isContextMenuCommand()){
		inter = client.interactions.get(interaction.commandName.replace(/\s/g, "_"));
		if(!inter) client.logger.warn(`No interaction found for Command ${interaction.commandName}`);
	}
	if(interaction.isModalSubmit()) {
		inter = client.interactions.get(interaction.customId.split("|")[0]);
		if(!inter) client.logger.warn(`No interaction found for Modal ${interaction.customId}`);
	}
	if(!inter) return;
	try{
		await inter.execute(client, interaction);
	}catch(e){
		client.logger.error("", e);
	}
};
