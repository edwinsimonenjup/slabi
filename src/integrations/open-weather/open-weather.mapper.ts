import type {
	OpenWeatherCurrentResponseDTO,
	UpsertCurrentWeatherDTO,
} from "./open-weather.dto";

export default class OpenWeatherMapper {
	mapCurrentWeather(
		raw: OpenWeatherCurrentResponseDTO,
	): UpsertCurrentWeatherDTO {
		return {
			lon: raw.coord.lon,
			lat: raw.coord.lat,
			weather: raw.weather[0].main,
			temp: raw.main.temp,
			pressure: raw.main.pressure,
			humidity: raw.main.humidity,
			wind_speed: raw.wind.speed,
			wind_degree: raw.wind.deg,
			sunrise: raw.sys.sunrise,
			sunset: raw.sys.sunset,
			location: raw.name,
		};
	}
}
