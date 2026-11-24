import type { NextFunction, Request, Response } from "express";

type ValidatorLike = {
	validate(data: unknown): Promise<unknown>;
};

export function validate(validator: ValidatorLike) {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			req.body = await validator.validate(req.body);
			next();
		} catch (error) {
			next(error);
		}
	};
}
