import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../error/app-error";

export function notFoundMiddleware(
	_req: Request,
	_res: Response,
	next: NextFunction,
) {
	next(new NotFoundError());
}
