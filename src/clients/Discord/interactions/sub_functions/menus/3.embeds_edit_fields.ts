import { Message, EmbedBuilder, SelectMenuInteraction, TextChannel } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildMessageEmbed from "@src/database/models/MessageEmbed";
import MessageEmbedField from "@src/database/models/MessageEmbedField";
import { Interaction } from "@src/types/Executors";
type tuple = [string, string];
const interaction: Interaction = {
	name: "embeds edit fields",
	type: "SubFunction",
	description: "Edit the menu-selected embed fields.",
	category: "data",
	internal_category: "sub",
	async execute(client: Bot, interaction: SelectMenuInteraction) {
		const id = interaction.customId.split("|")[1];
		if (!id) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No embed selected")
					.setDescription("Please select an embed to edit.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		const embedRepo = client.database.source.getRepository(GuildMessageEmbed);
		const embed = await embedRepo.findOne({ where: { id: parseInt(id) } });
		if (!embed) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Embed not found")
					.setDescription("Selected embed was not found.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		const option = interaction.values[0];
		if (!option) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("No option selected")
					.setDescription("Please select an option to manage the embed's fields.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		if (!interaction.channel || !(interaction.channel instanceof TextChannel)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Use a channel")
					.setDescription("This menu must be used in a text channel.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		await interaction.deferUpdate();

		const questions: string[] = [];
		switch (option) {
		case "list": {
			const fieldsEmbed = new EmbedBuilder()
				.setTitle("Embed fields")
				.setColor(`#${client.config.defaultEmbedColor}`);
			for await (const [index, field] of embed.fields.entries()) {
				fieldsEmbed.addFields({
					name: `${index}. ${field.title}`,
					value: field.value
				});
			}
			return interaction.channel.send({
				embeds: [fieldsEmbed],
			});
		}
		case "add":
			if (embed.fields.length >= 25) return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Too many fields")
						.setDescription("The embed can only have 25 fields.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
			});
			questions.push("Title");
			questions.push("Value");
			break;
		case "remove":
			questions.push("Index");
			break;
		case "edit":
			questions.push("Index");
			questions.push("Title");
			questions.push("Value");
			break;
		default:
			return interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setTitle("Invalid option")
						.setDescription("Please select a valid option to manage the embed's fields.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
			});
		}
		const responses: tuple[] = [];
		const filter = (m: Message) => m.author.id === interaction.user.id;
		for await (const question of questions) {
			interaction.channel.send({
				embeds: [
					new EmbedBuilder()
						.setTitle("Please enter the field's " + question)
						.setColor(`#${client.config.defaultEmbedColor}`)
				]
			});
			const awaitMsg = await interaction.channel.awaitMessages({ filter, max: 1, time: 30000 });
			const msg = awaitMsg.first();
			if (!msg) return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("No message received")
						.setDescription("No message was received in time. Cancelling.")
						.setColor(`#${client.config.defaultEmbedColor}`)
				],
				ephemeral: true
			});
			if (question === "Index") {
				const index = parseInt(msg.content);
				if (isNaN(index)) return interaction.channel.send({
					embeds: [
						new EmbedBuilder()
							.setTitle("Invalid index")
							.setDescription("Please enter a valid index.")
							.setColor(`#${client.config.defaultEmbedColor}`)
					],
				});
				if (index < 0 || index >= embed.fields.length) return interaction.channel.send({
					embeds: [
						new EmbedBuilder()
							.setTitle("Invalid index")
							.setDescription("Please enter a valid index.")
							.setColor(`#${client.config.defaultEmbedColor}`)
					],
				});
			}
			responses.push([question, msg.content]);
		}
		const fieldRepo = client.database.source.getRepository(MessageEmbedField);
		switch (option) {
		case "add": {
			const newField = new MessageEmbedField();
			newField.title = responses[0][1];
			newField.value = responses[1][1];
			newField.embed = embed;
			await fieldRepo.save(newField);
			//embed.fields.push(newField);
			break;
		}
		case "remove": {
			const id = embed.fields[parseInt(responses[0][1])].id;
			const field = await fieldRepo.findOne({
				where: { id }
			});
			field ? await fieldRepo.remove(field) : null;
			/* embed.fields.splice(parseInt(responses[0][1]), 1); */
			break;
		}
		case "edit": {
			const id = embed.fields[parseInt(responses[0][1])].id;
			const field = await fieldRepo.findOne({
				where: { id }
			});
			field ? field.title = responses[1][1] : null;
			field ? field.value = responses[2][1] : null;
			field ? await fieldRepo.save(field) : null;
			/* embed.fields[parseInt(responses[0][1])].title = responses[1][1];
			embed.fields[parseInt(responses[0][1])].value = responses[2][1]; */
			break;
		}
		}
		//await embedRepo.save(embed);

		if (interaction.isMessageComponent() && interaction.message instanceof Message){
			interaction.message.deletable ? await interaction.message.delete() : null;
		}

		return interaction.channel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Success")
					.setDescription("Embed successfully updated.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
		});
	}
};
export default interaction;