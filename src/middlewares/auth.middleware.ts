import type { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../error/app-error";
import { verifyToken } from "../utils/jwt";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header?.startsWith("Bearer ")) {
		return next(new UnauthorizedError("Missing bearer token"));
	}

	const token = header.slice("Bearer ".length);

	try {
		const payload = verifyToken(token, "access"); // throws if expired, tampered, or wrong type
		req.user = { id: payload.userId };
		next(); // token is valid, let the request through
	} catch {
		next(new UnauthorizedError("Invalid or expired token"));
	}
}
