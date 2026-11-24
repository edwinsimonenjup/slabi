import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../error/app-error.js";

export function requireApiKey(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	if (req.header("x-api-key") !== env.API_KEY) {
		return next(new UnauthorizedError("Invalid or missing API key"));
	}
	next();
}
