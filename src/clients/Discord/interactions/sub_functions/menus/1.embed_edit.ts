import { Message, EmbedBuilder, SelectMenuInteraction, TextChannel } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import { Interaction } from "@src/types/Executors";
const interaction: Interaction = {
	name: "embed edit",
	type: "SubFunction",
	description: "Edit the menu-selected embed.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const id = interaction.customId.split("|")[1];
		if(!id) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { id:parseInt(id) } });
		if(!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed not found")
					.setDescription("Selected embed was not found.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const option = interaction.values[0];
		if(!option) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No option selected")
					.setDescription("Please select an option to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		if(!interaction.channel || !(interaction.channel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Use a channel")
					.setDescription("This menu must be used in a text channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		if(option === "fields") {
			return client.interactions.get("embeds_manage_fields")?.execute(client, interaction);
		}

		const msgEmb = new EmbedBuilder();
		msgEmb.setTitle(`Editing embed [${embed.name}]`);
		msgEmb.setColor(`#${client.config.defaultEmbedColor}`);
		msgEmb.setFooter({ text: "Enter a single ¡ to mark it as empty" });
		let validateRegex = null;
		switch(option) {
		case "title":
			msgEmb.setDescription("Please enter the new title.");
			// Accepts any string up to 256 characters.
			validateRegex = /^.{1,256}$/;
			break;
		case "titleURL":
			msgEmb.setDescription("Please enter the new title URL.");
			// Accepts URLs up to 2048 characters.
			validateRegex = /^.{1,2048}$/;
			break;
		case "description":
			msgEmb.setDescription("Please enter the new description.");
			// Accepts any string up to 4096 characters.
			validateRegex = /^.{1,4096}$/;
			break;
		case "color":
			msgEmb.setDescription("Please enter the new color.");
			// Accepts any hex color code.
			validateRegex = /^[0-9a-f]{6}$/;
			break;
		case "footer":
			msgEmb.setDescription("Please enter the new footer text.");
			// Accepts any string up to 2048 characters.
			validateRegex = /^.{1,2048}$/;
			break;
		case "footerURL":
			msgEmb.setDescription("Please enter the new footer image URL.");
			// Accepts any URL ending in .png, .jpg, .jpeg, .gif.
			validateRegex = /^(https?:\/\/)?((w{3}\.)?)?([a-z0-9-]+\.)+[a-z]{2,63}(\/[a-z0-9-]*)*\/?$/;
			break;
		case "imageURL":
			msgEmb.setDescription("Please enter the new image URL.");
			// Accepts any URL ending in .png, .jpg, .jpeg, .gif.
			validateRegex = /^(https?:\/\/)?((w{3}\.)?)?([a-z0-9-]+\.)+[a-z]{2,63}(\/[a-z0-9-]*)*\.(png|jpg|jpeg|gif)$/;
			break;
		case "thumbnailURL":
			msgEmb.setDescription("Please enter the new thumbnail image URL.");
			// Accepts any URL ending in .png, .jpg, .jpeg, .gif.
			validateRegex = /^(https?:\/\/)?((w{3}\.)?)?([a-z0-9-]+\.)+[a-z]{2,63}(\/[a-z0-9-]*)*\.(png|jpg|jpeg|gif)$/;
			break;
		case "author":
			msgEmb.setDescription("Please enter the new author name.");
			// Accepts any string up to 256 characters.
			validateRegex = /^.{1,256}$/;
			break;
		case "authorURL":
			msgEmb.setDescription("Please enter the new author image URL.");
			// Accepts any URL ending in .png, .jpg, .jpeg, .gif.
			validateRegex = /^(https?:\/\/)?((w{3}\.)?)?([a-z0-9-]+\.)+[a-z]{2,63}(\/[a-z0-9-]*)*\.(png|jpg|jpeg|gif)$/;
			break;
		default:
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Invalid option")
						.setDescription("Please select a valid option.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
				
		}

		await interaction.reply({
			embeds: [msgEmb]
		});

		
		const filter = (m:Message) => m.author.id === interaction.user.id;
		const awaitMsg = await interaction.channel.awaitMessages({filter, max: 1, time: 30000});
		const msg = awaitMsg.first();
		if(!msg) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message received")
					.setDescription("No message was received in time. Cancelling.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if(!validateRegex || (!validateRegex.test(msg.content) && msg.content === "¡")) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Invalid input")
					.setDescription("Input was invalid. Cancelling.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		if(msg.content === "¡") {
			embed[`${option}`] = "";
		}
		else {
			embed[`${option}`] = msg.content;
		}
		await embedRepo.save(embed);
		return interaction.channel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed edited")
					.setDescription("Embed was edited successfully.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
		});
	}	
};
export default interaction;