import { GuildMember } from "discord.js";
import Bot from "@src/clients/Discord";

export default async (client: Bot,member:GuildMember) => {
	client.emit("welcome",{member});
};