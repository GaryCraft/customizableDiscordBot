import { Parseable, ValidateProperty } from "parzival";

@Parseable()
export default class DatabaseConfig {
	@ValidateProperty({
		type: "string",
		match: /^(mysql|sqlite)$/,
	})
	type!: "sqlite" | "mysql";

	@ValidateProperty({
		type: "string",
		// Either a path or a host
		match: /^([a-zA-Z0-9]+\/[a-zA-Z0-9]+\.db|([a-zA-Z0-9]+\.?)+)$/,
	})
	host!: string;

	@ValidateProperty({
		type: "number",
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
	sync!: boolean;

	@ValidateProperty({
		type: "boolean",
	})
	logging!: boolean;
}