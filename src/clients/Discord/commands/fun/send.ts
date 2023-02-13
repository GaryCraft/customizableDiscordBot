import { Message, TextChannel, Attachment, PermissionFlagsBits } from "discord.js";
import Bot from "@src/clients/Discord";
import { Command } from "@src/types/Executors";

const cmd: Command = {
	name: "send",
	aliases: [],
	category: "fun",
	description: "Receive what you sent!",
	usage: "{prefix}send",
	async execute(client: Bot, message: Message, args: string[]): Promise<void> {
		if (!message.member?.permissions.has(PermissionFlagsBits.Administrator) && !(client.config.admins.includes(message.member?.id as string))) return;

		let content = args.join(" ");
		let attachments: Attachment[] | undefined = [];
		if (message.attachments.size){
			for await (const [, attachment] of message.attachments) {
				attachments.push(attachment);
			}
		}
		attachments = attachments.length > 0 ? attachments : undefined;
		const channelIdRegex = /<#[0-9]{18,20}>/g;
		const channelId = args[0];
		if (channelIdRegex.test(channelId)) {
			const channel = await client.channels.fetch(channelId.replace(/[<#>]/g, ""));
			if (!channel) { message.channel.send("Could not find that channel."); return; }
			if (!(channel instanceof TextChannel)) { message.channel.send("That channel is not a text channel."); return; }
			content = content.replace(channelIdRegex, "");
			content = content.trim();
			content = content.length > 0 ? content : "** **";
			await channel.send({ content, files: attachments });
			message.react("✅");
		} else {
			content = content.length > 0 ? content : "** **";
			message.channel.send({ content, files: attachments });
		}
	},
};
export default cmd;