import { Parseable, ValidateProperty } from "parzival";
import DiscordConfig from "./discord";

@Parseable()
export default class ModuleConfigs {
	@ValidateProperty({
		type: "object",
		recurse: true,
		className: "DiscordConfig",
	})
	discord!: DiscordConfig;
}