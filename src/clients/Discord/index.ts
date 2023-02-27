/* eslint-disable @typescript-eslint/no-var-requires */
import { Client, Collection, GatewayIntentBits } from "discord.js";
import { Command, Interaction, Job } from "../../types/Executors";
import Schedule from "node-schedule";
import SPDatabase from "../../database";
import { Log } from "../../util/Logger";
import { BotConfig, DatabaseConfig } from "../../types/Config";
import { JSONPackage } from "../../types/JSONPackage";
import CLI from "../../cli";
import findRecursive from "@spaceproject/findrecursive";
import Config from "@src/modular/config";

const nonPrivilegedIntents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildBans,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildIntegrations,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.GuildScheduledEvents
];
const privilegedIntents = [
	GatewayIntentBits.MessageContent
];
let intents: GatewayIntentBits[] = [];
class Bot extends Client {
	logger: Log.Logger;
	readonly config: BotConfig;
	readonly dbConfig: DatabaseConfig;
	commands: Collection<string, Command>;
	interactions: Collection<string, Interaction>;
	jobs: Collection<string, Job>;
	readonly database: SPDatabase;

	readonly commandline: CLI;
	readonly package: JSONPackage;
	constructor() {
		if (process.env.NODE_ENV === "development") {
			intents = nonPrivilegedIntents.concat(privilegedIntents);
		}
		else {
			intents = nonPrivilegedIntents;
		}
		super({
			intents
		});
		this.logger = new Log.Logger();
		this.commands = new Collection();
		this.interactions = new Collection();
		this.jobs = new Collection();
		
		this.config = Config.getClientConfig("discord");
		this.dbConfig = require("../../config.js").database;
		this.database = new SPDatabase(this.dbConfig);
		this.commandline = new CLI(this, process.stdin, process.stdout);
		this.package = require("../package.json");
	}
	async registerEvents() {
		const events = await findRecursive(`${__dirname}/events`);
		for (const [file, dir] of events) {
			const event: VoidFunction = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Event ${file}`);
			this.on(file.split(".")[0], event.bind(null, this));
		}
	}
	async loadCommands() {
		const commands = await findRecursive(`${__dirname}/commands`);
		for (const [file, dir] of commands) {
			const command: Command = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Command ${file}`);
			this.commands.set(command.name, command);
		}
	}
	async loadInteractions() {
		const interactions = await findRecursive(`${__dirname}/interactions`);
		for (const [file, dir] of interactions) {
			const interaction: Interaction = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Interaction ${file}`);
			this.interactions.set(interaction.name.replace(/\s/g, "_"), interaction);
		}
	}
	async loadJobs() {
		const jobs = await findRecursive(`${__dirname}/jobs`);
		for (const [file, dir] of jobs) {
			const job: Job = await import(`${dir}/${file}`).then(m => m.default);
			this.logger.info(`Loading Job ${file}`);
			this.jobs.set(job.name, job);
		}
	}
	async startJobs() {
		this.jobs.forEach(job => {
			Schedule.scheduleJob(job.name, job.cronInterval, job.task.bind(null, this));
		});
	}
	async start() {
		await this.database.init();
		await this.registerEvents();
		await this.loadCommands();
		await this.loadInteractions();
		await this.loadJobs();
		await this.login(this.config.token);
		await this.startJobs();
	}
}
export default Bot;