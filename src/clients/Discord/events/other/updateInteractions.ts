import { ApplicationCommandDataResolvable, ApplicationCommandType, Guild } from "discord.js";
import { EventExecutor } from "@src/types/Executors";

interface CleanInteraction {
	name: string;
	description: string | undefined;
	category: string | null;
	internal_category: string | null;
}

const e: EventExecutor<{ guild?: Guild } | undefined> = async (client, params) => {
	const guild = params?.guild;
	if(!guild){
		const arr:CleanInteraction[] = [];
		for await (const [,interaction] of client.interactions.entries()) {
			if(interaction.type === "SubFunction") continue;
			const cleanInt:CleanInteraction = {...interaction};
			cleanInt.description = (interaction.type == ApplicationCommandType.User || interaction.type == ApplicationCommandType.Message) ? undefined : interaction.description;
			cleanInt.category = null;
			if(cleanInt.internal_category == "app")arr.push(cleanInt);
		}
		try {
			client.application?.commands.set(arr as ApplicationCommandDataResolvable[]);
		} catch (e) {
			console.log("Error while updating App Interactions: ", e);
		}
		return;
	}

	const arr:CleanInteraction[] = [];
	for await (const [,interaction] of client.interactions.entries()) {
		if(interaction.type === "SubFunction") continue;
		const cleanInt:CleanInteraction = {...interaction};
		cleanInt.description = (interaction.type == ApplicationCommandType.User || interaction.type == ApplicationCommandType.Message) ? undefined : interaction.description;
		cleanInt.category = null;
		if(cleanInt.internal_category == "guild")arr.push(cleanInt);
	}
	try {
		await guild.commands.set(arr as ApplicationCommandDataResolvable[]);
	} catch(e) {
		console.log("Found Guild but couldn't Update Interactions", e);
	}finally {
		console.log("Updated Interactions for", guild.name);
	}
};
export default e;