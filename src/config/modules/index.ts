import { Parseable, ValidateProperty } from "parzival";
import DiscordConfig from "./discord";
//$StripStart
//$StripEnd

@Parseable()
export default class ModuleConfigs {
	@ValidateProperty({
		type: "object",
		recurse: true,
		className: "DiscordConfig",
	})
	discord!: DiscordConfig;
	//$StripStart
	//$StripEnd
}