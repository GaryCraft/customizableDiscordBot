import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "@src/clients/Discord";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "embeds",
	type: ApplicationCommandType.ChatInput,
	description: "Manage this server's embeds.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "create",
			description: "Create an embed.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "name",
					description: "The embed name.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: "edit",
			description: "Edit an embed with an interactive menu.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "delete",
			description: "Delete an embed.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "list",
			description: "List this server's embeds.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "send",
			description: "List this server's embeds.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "embed",
					description: "The embed to send.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "channel",
					description: "The channel to send the embed to.",
					type: ApplicationCommandOptionType.Channel,
					required: true,
				}
			],

		},

	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		if(
			!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) && 
			!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) &&
			!client.config.admins.includes(interaction.user.id)
		) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("You do not have permission to use this command.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		switch (interaction.options.getSubcommand()) {
		case "create":
			client.interactions.get("embeds_create")?.execute(client, interaction);
			break;
		case "edit":
			client.interactions.get("embeds_edit")?.execute(client, interaction);
			break;
		case "delete":
			client.interactions.get("embeds_delete")?.execute(client, interaction);
			break;
		case "list":
			client.interactions.get("embeds_list")?.execute(client, interaction);
			break;
		case "send":
			client.interactions.get("embeds_send")?.execute(client, interaction);
			break;
		default:
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Command not found")
						.setColor(`#${client.config.defaultEmbedColor}`)
				]
			});
			break;
		}

	}
};
export default interaction;