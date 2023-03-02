import { initialize } from "@src/modular/initialize";
import { App } from "./app";

const app = new App();

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
process.on("uncaughtException", (error) => {
	console.error("Uncaught Exception at:", error);
});

app.on("ready", () => {
	console.log("App ready");
});

