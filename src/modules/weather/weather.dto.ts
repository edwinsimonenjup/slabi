export type WeatherDTO = {
	location: string;
	weather: string;
	temp: number;
	pressure: number;
	humidity: number;
	wind_speed: number;
	wind_degree: number;
	sunrise: number;
	sunset: number;
};

export type locationDTO = {
	location: string;
	lat: number;
	lon: number;
};
