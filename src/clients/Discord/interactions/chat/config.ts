import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildData from "@src/database/models/GuildData";
import { Interaction } from "@src/types/Executors";

const interaction: Interaction = {
	name: "config",
	type: ApplicationCommandType.ChatInput,
	description: "Configure the bot's behaviour in this server.",
	category: "other",
	internal_category: "guild",
	options: [
		{
			name: "welcome",
			description: "Welcome Configuration",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the welcome message.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "status",
							description: "Is the welcome message enabled.",
							type: ApplicationCommandOptionType.Boolean,
							required: true,
						}
					]
				},
				{
					name: "channel",
					description: "Set the channel the welcome message will be sent to.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "welcome_channel",
							description: "The channel the welcome message will be sent to.",
							type: ApplicationCommandOptionType.Channel,
							required: true,
						}
					]
				},
				{
					name: "message",
					description: "Set the welcome message.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "name",
							description: "The welcome message embed name.",
							type: ApplicationCommandOptionType.String,
							required: true,
						}
					]
				}
			],
		},
		{
			name: "suggestions",
			description: "Suggestions Configuration",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the suggestions.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "status",
							description: "Is the suggest command enabled.",
							type: ApplicationCommandOptionType.Boolean,
							required: true,
						}
					]
				},
				{
					name: "channels",
					description: "Set the channel the welcome message will be sent to.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "admin_channel",
							description: "The channel suggestions will be sent to be reviewed.",
							type: ApplicationCommandOptionType.Channel,
							required: true,
						},
						{
							name: "vote_channel",
							description: "The channel suggestions will be sent to be voted for.",
							type: ApplicationCommandOptionType.Channel,
							required: true,
						}
					]
				},
			],
		},
		{
			name: "verify",
			description: "Verification Configuration",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "enabled",
					description: "Enable/Disable the verify message.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "status",
							description: "Is the verify message enabled.",
							type: ApplicationCommandOptionType.Boolean,
							required: true,
						}
					]
				},
				{
					name: "channel",
					description: "Set the channel the verify message will be sent to.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "verify_channel",
							description: "The channel the verify message will be sent to.",
							type: ApplicationCommandOptionType.Channel,
							required: true,
						}
					]
				},
				{
					name: "message",
					description: "Set the welcome message.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "name",
							description: "The verify message embed name.",
							type: ApplicationCommandOptionType.String,
							required: true,
						}
					]
				},
				{
					name: "button_label",
					description: "Set the button label.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "label",
							description: "The button label.",
							type: ApplicationCommandOptionType.String,
							required: true,
						}
					]
				},
				{
					name: "button_emoji",
					description: "Set the button emoji.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "emoji",
							description: "The button emoji.",
							type: ApplicationCommandOptionType.String,
							required: true,
						}
					]
				},
				{
					name: "role",
					description: "Set the role the user will be given when they verify.",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "verified_role",
							description: "The role the user will be given when they verify.",
							type: ApplicationCommandOptionType.Role,
							required: true,
						}
					]
				},
				{
					name: "send",
					description: "Send the verification message to the configured channel.",
					type: ApplicationCommandOptionType.Subcommand,
				}
			],
		},
		{
			name: "museum",
			description: "Set a Museum dedicated Channel.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "channel",
					description: "Set the channel Museum Messages will be Saved to.",
					type: ApplicationCommandOptionType.Channel,
					required: true,
				}
			]
		},
		{
			name: "confessions",
			description: "Set a Confessions dedicated Channel.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "channel",
					description: "Set the channel confession messages will be Sent to.",
					type: ApplicationCommandOptionType.Channel,
					required: true,
				}
			]
		},
		{
			name: "init",
			description: "Initialize the bot's behaviour in this server.",
			type: ApplicationCommandOptionType.Subcommand,
		}
	],
	async execute(client: Bot, interaction: ChatInputCommandInteraction) {
		if (
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
		const category = interaction.options.getSubcommand();

		if (category === "init" && interaction.guildId) {
			const guildDataRepo = client.database.source.getRepository(GuildData);
			const guildData = await guildDataRepo.findOne({ where: { guildId: interaction.guildId } });
			if (!guildData) {
				const newGuildData = new GuildData();
				newGuildData.guildId = interaction.guildId;
				await guildDataRepo.save(newGuildData);
			}
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Successfully initialized.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
		}

		const group = interaction.options.getSubcommandGroup(false) ? interaction.options.getSubcommandGroup() : "config";


		const inter = client.interactions.get(`${group}_${category}`);
		if (!inter) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Configuration not found")
					.setColor(`#${client.config.defaultEmbedColor}`)
			]
		});

		await inter.execute(client, interaction);


	}
};
export default interaction;