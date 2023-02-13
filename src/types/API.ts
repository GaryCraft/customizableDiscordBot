import Bot from "../clients/Discord";
import { Request } from "express";

interface ServerRequest extends Request {
	parentApp: Bot;
}

export { ServerRequest };