import { ShardingManager } from "discord.js";
import EventEmitter from "events";
import API from "./api";
import CLI from "./cli";
import Config from "./modular/config";
import { initialize } from "./modular/initialize";
import { Log } from "./modular/logging";
import { AppConfig } from "./types/Config";

export class App extends EventEmitter {
	api: API;
	cli: CLI;
	config: AppConfig;
	shardingManager: ShardingManager;
	constructor() {
		super();
		initialize();
		Log.Logger.info("Main App", "App starting...");
		this.config = Config.getFullConfig();
		this.api = new API();
		this.cli = new CLI(this, process.stdout, process.stdin);
		const thisFileExtension = __filename.split('.').pop();
		this.shardingManager = new ShardingManager(`${__dirname}/index.${thisFileExtension}`, {
			token: process.env.TOKEN || Config.getClientConfig("discord").token,
		});
		this.shardingManager.on("shardCreate", (shard) => {
			Log.Logger.info("Main App", `Shard ${shard.id} created`);
		});
		this.shardingManager.spawn({timeout: -1});
	}


}