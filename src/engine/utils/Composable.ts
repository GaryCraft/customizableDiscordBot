import appCtx from "@src/application";

export const getAppContext = () => appCtx;

export const getDatabase = () => appCtx.database;

export const getScheduler = () => appCtx.tasks.scheduler;

export const getHttpServer = () => appCtx.http.server;
export const getHttpWSServer = () => appCtx.http.websockets;

export const getCLI = () => appCtx.cli;