import { DataSource } from "typeorm";
import { DatabaseConfig } from "../types/Config";
import { Log } from "../util/ClientLogger";
class SPDatabase {
	private logger!: Log.Logger;
	private static instance: SPDatabase | null = null;
	private static source: DataSource;
	constructor(dbconfig: DatabaseConfig) {
		if(SPDatabase.instance)
			return SPDatabase.instance;
		this.logger = new Log.Logger();
		SPDatabase.source = new DataSource({
			type: dbconfig.type,
			database: dbconfig.type === "sqlite" ? "./temp/sp.db" : dbconfig.database,
			// MySQL
			host: dbconfig.host,
			port: dbconfig.port,
			username: dbconfig.user,
			password: dbconfig.password,
			// More options
			synchronize: dbconfig.sync,
			logging: dbconfig.verbose,
			entities: [
				__dirname + "/../database/models/*.js",
			],
			charset:  dbconfig.type === "sqlite" ? undefined : "utf8mb4",
		});
		SPDatabase.instance = this;
	}
	async init() {
		try{
			this.logger.info("[SPDatabase]", "Persistent database initializing.");
			await SPDatabase.source.initialize();
			this.logger.info("[SPDatabase]", "Persistent database initialized.");
		}
		catch(e){
			this.logger.error("[SPDatabase]", "Error initializing persistent database: ", e);
			throw e;
		}
	}
	get source() {
		return SPDatabase.source;
	}
}
export default SPDatabase;