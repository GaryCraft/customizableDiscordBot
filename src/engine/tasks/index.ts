import { ScheduledTask } from "../types/Executors";
import Schedule from "node-schedule";

export default class TaskManager {
	readonly scheduler: typeof Schedule;
	readonly jobs: Map<string, ScheduledTask>;
	constructor() {
		this.jobs = new Map();
		this.scheduler = Schedule;
	}
}