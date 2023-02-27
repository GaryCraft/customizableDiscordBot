import { Parseable, ValidateProperty } from "parzival";

@Parseable()
class BotConfig {
	@ValidateProperty({
		type: "string",
	})
	prefix!: string;
	@ValidateProperty({
		type: "string",
	})
	token!: string;
	@ValidateProperty({
		type: "array",
		subType: "string",
	})
	admins!: string[];
	activity!: {
		message: string;
		type: string;
	};
	@ValidateProperty({
		type: "string",
	})
	defaultEmbedColor!: string;
};
@Parseable()

class DatabaseConfig {
	@ValidateProperty({
		type: "string",
		match: /^(sqlite|mysql)$/,
	})
	type!: "sqlite" | "mysql";
	@ValidateProperty({
		type: "string",
	})
	host!: string;
	@ValidateProperty({
		type: "number",
		min: 1,
		max: 65535,
	})
	port!: number;
	@ValidateProperty({
		type: "string",
	})
	user!: string;
	@ValidateProperty({
		type: "string",
	})
	password!: string;
	@ValidateProperty({
		type: "string",
	})
	database!: string;
	@ValidateProperty({
		type: "boolean",
	})
	verbose!: boolean;
	@ValidateProperty({
		type: "boolean",
	})
	sync!: boolean;
};
@Parseable()
class APIConfig {
	@ValidateProperty({
		type: "string",
	})
	password!: string;
	@ValidateProperty({
		type: "number",
	})
	port!: number;
};
@Parseable()
class AppConfig {
	clients!: {
		[client: string]: BotConfig;
	};
	@ValidateProperty({
		type: "object",
		className: "DatabaseConfig",
		recurse: true,
	})
	database!: DatabaseConfig;
	@ValidateProperty({
		type: "object",
		className: "APIConfig",
		recurse: true,
	})
	api!: APIConfig;
}

export { AppConfig, BotConfig, DatabaseConfig, APIConfig };