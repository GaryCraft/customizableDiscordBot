import { Parseable, ValidateProperty } from "parzival";
import { Response } from "express";
import { ApplicationContext } from "./Engine";

@Parseable()
export class CliCommand {
	@ValidateProperty({
		type: "string"
	})
	name!: string;
	@ValidateProperty({
		type: "string"
	})
	description!: string;
	@ValidateProperty({
		type: "string"
	})
	usage!: string;
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	async execute(app: ApplicationContext, args: string[]): Promise<unknown> {
		throw new Error("Method not implemented.");
	}
}

@Parseable()
export class ScheduledTask {
	@ValidateProperty({
		type: "string"
	})
	name!: string;
	@ValidateProperty({
		type: "string",
		validateName: true
	})
	cronInterval!: string;
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	async task(app: ApplicationContext): Promise<void> {
		throw new Error("Method not implemented.");
	}
}


@Parseable()
export class HTTPRouteHandler {
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	get(req: Express.Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	post(req: Express.Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	put(req: Express.Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	delete(req: Express.Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
	@ValidateProperty({
		type: "function",
		validateArguments: false,
		validateReturns: false
	})
	patch(req: Express.Request, res: Response): Promise<void> {
		throw new Error("Method not implemented.");
	}
}

export interface HookExecutor {
	(ctx: ApplicationContext): Promise<void>;
}