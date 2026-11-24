import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/app-error";

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof AppError)
		return res
			.status(err.statusCode)
			.json({ success: false, message: err.message });

	// Handle invalid JSON body sent to express.json()
	if (err instanceof SyntaxError && "body" in err)
		return res
			.status(400)
			.json({ success: false, message: "Invalid JSON payload" });

	console.error(err); // anything else is a real bug -- log it, don't leak it
	res.status(500).json({ success: false, message: "Internal server error" });
}
