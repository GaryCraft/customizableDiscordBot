/* eslint-disable */
import winston from "winston";

function getLogDate() {
	const date = new Date();
	return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
export namespace Log {
	export class Logger {
		private static instance: Logger | null = null;
		private logger!: winston.Logger;
		constructor() {
			if (Logger.instance)
				return Logger.instance;
			this.logger = winston.createLogger({
				level: process.env.NODE_ENV === "development" ? "debug" : "info",
				format: winston.format.json(),
				transports: [
					new winston.transports.Console({
						format: winston.format.simple(),
					}),
					new winston.transports.File({
						filename: `./temp/logs/${getLogDate()}.log`,
						format: winston.format.simple(),
					}),
				],
			});
			Logger.instance = this;
		}
		log(source: string = "General", level: LogLevel, message: string, ...args: any[]) {
			this.logger.log(level, `${source} ${message}`, ...args);
		}
		info(source: string = "General", message: string, ...args: any[]) {
			this.logger.info(`${source} ${message}`, ...args);
		}
		warn(source: string = "General", message: string, ...args: any[]) {
			this.logger.warn(`${source} ${message}`, ...args);
		}

		error(source: string, error: Error): void;
		error(source: string, message: string, ...args: any[]): void;
		error(source: string = "General", either: string | Error, ...args: any[]) {
			if (typeof either === "string") {
				this.logger.error(`${source} ${either}`, ...args);
			} else {
				this.logger.error(`${source}`, either);
			}
		}

		debug(object: any): void;
		debug(message: string, ...args: any[]): void;
		debug(arg0: string | any, ...args: any[]) {
			if (typeof arg0 === "string") {
				this.logger.debug(arg0, ...args);
			} else {
				this.logger.debug(arg0);
			}
		}
		silly(message: string, ...args: any[]) {
			this.logger.silly(message, ...args);
		}

	}
	export enum LogLevel {
		INFO = "info",
		WARN = "warn",
		ERROR = "error",
		DEBUG = "debug",
	}

}