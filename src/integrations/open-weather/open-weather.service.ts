import logger from "../../utils/logger";
import OpenWeatherClient from "./open-weather.client";
import OpenWeatherMapper from "./open-weather.mapper";
import OpenWeatherRepository from "./open-weather.repository";

export default class OpenWeatherService {
	constructor(
		private readonly client = new OpenWeatherClient(),
		private readonly repository = new OpenWeatherRepository(),
		private readonly mapper = new OpenWeatherMapper(),
	) {}

	async insertCurrentWeather(): Promise<void> {
		const lon = 110.3718;
		const lat = 1.5519;

		try {
			const raw = await this.client.getCurrentDate(lat, lon, "metric");
			const readings = this.mapper.mapCurrentWeather(raw);

			await this.repository.upsertWeather(readings);
			logger.info("Current weather data inserted");
		} catch (error) {
			logger.error("OpenWeather API calling failed", error);
		}
	}
}
