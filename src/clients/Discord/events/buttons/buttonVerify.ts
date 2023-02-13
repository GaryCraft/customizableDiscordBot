import { ButtonInteraction, GuildMember, EmbedBuilder } from "discord.js";
import Bot from "@src/clients/Discord";
import GuildVerify from "@src/database/models/GuildVerify";
import { EventExecutor } from "@src/types/Executors";
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const e: EventExecutor<{interaction:ButtonInteraction}> = async (client: Bot, params) => {
	const { interaction } = params;
	if (interaction.user.bot) return client.logger.info(`Verify ${interaction.user.tag} is a bot, ignoring`);
	try {
		const verifyRepo = client.database.source.getRepository(GuildVerify);
		const verify = await verifyRepo.findOne({ where: { guildId: `${interaction.guildId}` } });
		if (!verify) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verificaton not found")
					.setDescription("Please contact the bot's administrator.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		if (!verify.verifyRole) return;

		if (!(interaction.member instanceof GuildMember)) return;

		if (interaction.member.roles.cache.has(verify.verifyRole)) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Already verified")
					.setDescription("You have already been verified.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});

		//Next line only enabled when captcha is not enabled
		interaction.deferUpdate();

		/* const captcha = new Captcha();
		const attach = new AttachmentBuilder(captcha.JPEGStream, "captcha.jpeg");
		const message = await interaction.member.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verification")
					.setDescription("Please type out what you can read.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			files: [attach]
		}).catch((e) => {
			client.logger.warn(`Failed to send DM to ${interaction.user.tag}`, e);
		});
		if (!message) return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle("Verification failed")
					.setDescription("You must be able to receive a DM to verify.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
			ephemeral: true
		});
		await interaction.deferUpdate();
		const filter = (m: Message) => m.author.id === interaction.user.id;
		const awaitMsg = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });
		const msg = awaitMsg.first();
		if (!msg) return interaction.member.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("No message received")
					.setDescription("No message was received in time. Cancelling.")
					.setColor(`#${client.config.defaultEmbedColor}`)
			],
		}).catch(() => {
			client.logger.warn(`Failed to notice ${interaction.user.tag} about verification timeout`);
		}); */
		//if (msg.content.toUpperCase() === captcha.value) {
		await interaction.member.roles.add(verify.verifyRole);
		client.logger.info(`${interaction.user.tag} has been verified`);
		//}
		//await message.delete();
	} catch (e) {
		client.logger.error("Error in buttonVerify.ts", e);
	}
};
export default e;