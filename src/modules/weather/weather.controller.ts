import type { Request, Response } from "express";
import WeatherService from "./weather.service";

const service = new WeatherService();

export default class WeatherController {
	async getLocation(_req: Request, res: Response) {
		const data = await service.getLocation();
		return res.status(200).json({
			success: true,
			message: "Location list retrieved successfully",
			data,
		});
	}

	async getDetails(req: Request, res: Response) {
		const { location } = req.body;
		const data = await service.getDetails(location);
		return res.status(200).json({
			success: true,
			message: "Weather details retrieved successfully",
			data,
		});
	}
}
