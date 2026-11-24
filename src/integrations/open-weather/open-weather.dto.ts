export type OpenWeatherWeather = {
	id: number;
	main: string;
	description: string;
	icon: string;
};

export type OpenWeatherCurrentResponseDTO = {
	coord: {
		lon: number;
		lat: number;
	};
	weather: OpenWeatherWeather[];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
};

export type UpsertCurrentWeatherDTO = {
	lon: number;
	lat: number;
	weather: string;
	temp: number;
	pressure: number;
	humidity: number;
	wind_speed: number;
	wind_degree: number;
	sunrise: number;
	sunset: number;
	location: string;
};
