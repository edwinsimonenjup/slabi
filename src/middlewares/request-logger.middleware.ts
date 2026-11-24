// src/middlewares/request-logger.middleware.ts
import type { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
	const isSwaggerAsset = req.path.startsWith("/docs/") && req.path !== "/docs/";

	if (isSwaggerAsset || req.path === "/health") return next();

	const start = performance.now();

	res.on("finish", () => {
		const durationMs = (performance.now() - start).toFixed(1);
		const msg = `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationMs}ms`;

		if (res.statusCode >= 500) {
			logger.error(msg);
		} else if (res.statusCode >= 400) {
			logger.warn(msg);
		} else {
			logger.info(msg);
		}
	});

	next();
}
