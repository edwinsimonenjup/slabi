import type { OpenWeatherCurrentResponseDTO } from "./open-weather.dto";

export default class OpenWeatherClient {
	private BASE_URL =
		process.env.FREE_OPENWEATHER_BASE_URL ??
		"https://api.openweathermap.org/data/2.5";
	private API_KEY = process.env.FREE_OPENWEATHER_API_KEY as string;

	private async getJson<T>(
		path: string,
		params?: Record<string, string>,
	): Promise<T> {
		const url = new URL(`${this.BASE_URL}${path}`);
		for (const [k, v] of Object.entries(params ?? {}))
			url.searchParams.set(k, v);

		const res = await fetch(url, { signal: AbortSignal.timeout(60_000) }); // Node 18+
		if (!res.ok) {
			throw new Error(
				`OpenWeather data ${res.status} ${res.statusText} for ${url.pathname}`,
			);
		}
		return (await res.json()) as T;
	}

	async getCurrentDate(
		lat: number,
		lon: number,
		units: "metric" | "imperial" | "standard" = "metric",
	): Promise<OpenWeatherCurrentResponseDTO> {
		return this.getJson<OpenWeatherCurrentResponseDTO>("/weather", {
			lat: String(lat),
			lon: String(lon),
			units,
			appid: this.API_KEY,
		});
	}
}
