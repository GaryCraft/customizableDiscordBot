import { Guild } from "discord.js";
import Bot from "../../Bot";

interface CleanInteraction {
	name: string;
	description: string;
	category: string | null;
	internal_category: string | null;
}

export default async (client: Bot, guild: Guild) => {
	if(!guild){
		const arr:CleanInteraction[] = [];
		for await (const [,interaction] of client.interactions.entries()) {
			if(interaction.type === "SUB_FUNCTION") continue;
			const cleanInt:CleanInteraction = {...interaction};
			!(interaction.type == "USER" || interaction.type == "MESSAGE") ? cleanInt.description = interaction.description : null;
			cleanInt.category = null;
			if(cleanInt.internal_category == "app")arr.push(cleanInt);
		};
		try {
			client.application!.commands.set(arr);
		} catch (e) {
			console.log("Error while updating App Interactions: ", e);
		}
		return;
	}

	const arr:CleanInteraction[] = [];
	for await (const [,interaction] of client.interactions.entries()) {
		if(interaction.type === "SUB_FUNCTION") continue;
		const cleanInt:CleanInteraction = {...interaction};
		!(interaction.type == "USER" || interaction.type == "MESSAGE") ? cleanInt.description =  interaction.description : null;
		cleanInt.category = null;
		if(cleanInt.internal_category == "guild")arr.push(cleanInt);
	};
	try {
		await guild.commands.set(arr);
	} catch(e) {
		console.log("Found Guild but couldn't Update Interactions", e);
	}finally {
		console.log("Updated Interactions for", guild.name);
	}
};