// src/utils/logger.ts
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "../config/env";

const logger = winston.createLogger({
	level: env.LOG_LEVEL ?? "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.printf(({ timestamp, level, message, stack }) =>
			stack
				? `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`
				: `${timestamp} [${level.toUpperCase()}] ${message}`,
		),
	),
	transports: [
		new winston.transports.Console(),
		new DailyRotateFile({
			dirname: "logs",
			filename: "app-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			maxFiles: "14d",
		}),
	],
});

export default logger;
