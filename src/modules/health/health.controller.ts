import type { Request, Response } from "express";
import HealthService from "./health.service";

const service = new HealthService();

export default class HealthController {
	async check(_req: Request, res: Response) {
		const up = await service.isDatabaseUp();
		return res.status(up ? 200 : 503).json({ status: up ? "ok" : "down" });
	}
}
