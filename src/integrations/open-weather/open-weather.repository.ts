import { prisma } from "../../lib/prisma";
import type { UpsertCurrentWeatherDTO } from "./open-weather.dto";

export default class OpenWeatherRepository {
	async upsertWeather(data: UpsertCurrentWeatherDTO) {
		return prisma.weather.upsert({
			where: {
				lat_lon: {
					lat: data.lat,
					lon: data.lon,
				},
			},
			update: {
				location: data.location,
				weather: data.weather,
				temp: data.temp,
				pressure: data.pressure,
				humidity: data.humidity,
				windSpeed: data.wind_speed,
				windDegree: data.wind_degree,
				sunrise: data.sunrise,
				sunset: data.sunset,
			},
			create: {
				lat: data.lat,
				lon: data.lon,
				location: data.location,
				weather: data.weather,
				temp: data.temp,
				pressure: data.pressure,
				humidity: data.humidity,
				windSpeed: data.wind_speed,
				windDegree: data.wind_degree,
				sunrise: data.sunrise,
				sunset: data.sunset,
			},
		});
	}
}
