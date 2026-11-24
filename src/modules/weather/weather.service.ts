import { prisma } from "../../lib/prisma";
import type { locationDTO, WeatherDTO } from "./weather.dto";

export default class WeatherService {
	async getLocation(): Promise<locationDTO[]> {
		const list = await prisma.weather.findMany({
			select: {
				id: true,
				location: true,
				lat: true,
				lon: true,
			},
		});

		if (!list) throw new Error("No location found in the system");

		return list.map((item) => ({
			id: item.id,
			location: item.location,
			lat: item.lat,
			lon: item.lon,
		}));
	}

	async getDetails(location: string): Promise<WeatherDTO> {
		const details = await prisma.weather.findFirst({
			where: { location: location },
			select: {
				location: true,
				weather: true,
				temp: true,
				pressure: true,
				humidity: true,
				wind_speed: true,
				wind_degree: true,
				sunrise: true,
				sunset: true,
			},
		});

		if (!details)
			throw new Error("No weather details found for the specified location");

		return {
			location: details.location,
			weather: details.weather,
			temp: details.temp,
			pressure: details.pressure,
			humidity: details.humidity,
			wind_speed: details.wind_speed,
			wind_degree: details.wind_degree,
			sunrise: details.sunrise,
			sunset: details.sunset,
		};
	}
}
