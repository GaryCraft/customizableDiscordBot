import { simpleGit, SimpleGitOptions, CheckRepoActions } from 'simple-git';
import { ScheduledTask } from "@src/engine/types/Executors";
import { debug, error, info } from "@src/engine/utils/Logger";
import path from "path";
import { getTempPath, getWebPublicDir } from "@src/engine/utils/Runtime";
import fs from "fs";
import { spawnChild } from "@src/engine/utils/Process";
import ExtendedClient from "@src/modules/discord/extendedclient";
import { getConfigProperty } from '@src/engine/utils/Configuration';
import WebFromGitConfig from '@src/config/modules/web_from_git';

const WebStorageBasePath = path.join(getTempPath(), "webpage");

const GITOPTIONS: Partial<SimpleGitOptions> = {
	baseDir: WebStorageBasePath,
	binary: 'git',
	maxConcurrentProcesses: 6,
	trimmed: false,
};

export default {
	name: "BuildWebsite",
	cronInterval: "* * * * *",
	async task(app) {
		const cfg = getConfigProperty<WebFromGitConfig>("modules.web_from_git");
		if (!cfg) {
			error("No config found for web_from_git");
			return;
		}
		if (!cfg.enabled) {
			return;
		}
		/* if (app.config.node_env !== "production") {
			debug("Not building site in development mode");
			return;
		} */
		debug("Checking repo for changes");
		// does directory exist?
		if (!fs.existsSync(WebStorageBasePath)) {
			debug("Creating web storage directory", WebStorageBasePath);
			fs.mkdirSync(WebStorageBasePath, { recursive: true });
		}
		const repoUrl = `https://${cfg.gitUser}:${cfg.gitSecret}@${cfg.gitRepo}`
		const git = simpleGit(GITOPTIONS);
		try {
			debug(WebStorageBasePath)
			// is there a repo?
			const exists = await git.checkIsRepo(CheckRepoActions.IS_REPO_ROOT);
			if (!exists) {
				debug("Cloning repo", cfg.gitRepo, "to", WebStorageBasePath);
				await git.clone(repoUrl, WebStorageBasePath);
			}
			// are there remote changes?
			await git.fetch();
			const status = await git.status();
			const hasIndexHtml = fs.existsSync(path.join(getWebPublicDir(), "index.html"));
			if (status.behind > 0) {
				// pull the changes
				await git.pull();
			}
			else if (!hasIndexHtml) {
				debug("No index.html found, not skipping build");
			}
			else {
				debug("No changes in the repo, skipping build");
				return;
			}
		}
		catch (e) {
			error("Error checking repo for changes!", e);
		}

		app.events.emit("modules:discord:siteBuildStarted")
		info("Repo checked for changes, building site!");
		// build the site, expecting to use npm run build
		let buildError = false;
		try {
			const npmVersion = await spawnChild("npm -v");
			const nodeVersion = await spawnChild("node -v");
			debug("Node version", nodeVersion.stdout);
			debug("NPM version", npmVersion.stdout);

			// dependencies
			const installed = await spawnChild("npm install", {
				cwd: WebStorageBasePath,
			});
			debug("Dependencies installed!", installed.stdout, installed.stderr);
			// build
			const built = await spawnChild("npm run build", {
				cwd: WebStorageBasePath,
			});
			debug("Build Result", built.stdout, built.stderr);

		} catch (e) {
			error("Error building site!", e);
			buildError = true;
		}
		if (buildError) {
			error("Site build failed!");
			return;
		}
		debug("Site built!");
		app.events.emit("modules:discord:siteBuildCompleted")

		info("Done!")
	},
} satisfies ScheduledTask;