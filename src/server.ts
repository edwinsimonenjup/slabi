import cron from "node-cron";
import app from "./app";
import appConfig from "./config/app.config";
import { env } from "./config/env";
import OpenWeatherService from "./integrations/open-weather/open-weather.service";
import { prisma } from "./lib/prisma";
import logger from "./utils/logger";

const openWeatherService = new OpenWeatherService();
let activeWeatherJob: Promise<unknown> | null = null;

const weatherCron = cron.schedule("*/30 * * * *", () => {
	if (activeWeatherJob) return;

	logger.info("Initiating get current weather data...");
	activeWeatherJob = openWeatherService
		.insertCurrentWeather()
		.then(() => logger.info("Get current weather data."))
		.catch((err) => logger.error("Get current weather insertion failed:", err))
		.finally(() => {
			activeWeatherJob = null;
		});
});

const server = app.listen(appConfig.port, () => {
	console.log(`${appConfig.name} running on ${appConfig.url}`);
	logger.info(`${env.APP_NAME} running on port ${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal: string) => {
	logger.info(`${signal} received, shutting down gracefully...`);
	setTimeout(() => process.exit(1), 10_000).unref(); // Safety net if a connection hangs

	weatherCron.stop();
	server.close(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
