import { Parseable, ValidateProperty } from "parzival";

@Parseable()
export default class WebFromGitConfig {
	@ValidateProperty({
		type: "string",
	})
	gitUser!: string;

	@ValidateProperty({
		type: "string",
	})
	gitSecret!: string;

	@ValidateProperty({
		type: "string",
	})
	gitRepo!: string;
}