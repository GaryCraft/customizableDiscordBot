// @ts-check
/** @typedef {import('../src/config/index.ts').default} DefinedConfig */
/** @type {DefinedConfig} */
module.exports = {
	// Database
	database: {
		// Either 'sqlite' or 'mysql'
		type: "sqlite",
		// Ingored if type is 'sqlite'
		database: "database",
		// MySQL Specific Settings
		host: "localhost",
		port: 3306,
		user: "root",
		password: "password",
		// Other Settings
		sync: false,
		logging: false,
	},
	// HTTP Server
	http: {
		port: 5000,
		wsPort: 5001,
	},
	modules: {
		discord: {
			prefix: "!",
			token: process.env.DISCORD_TOKEN,
		}
	}
};