import "dotenv/config";

type NodeEnv = "development" | "test" | "production";

function getEnv(name: string, fallback?: string): string {
	const value = process.env[name] ?? fallback;

	if (value === undefined || value === "") {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function getNumberEnv(name: string, fallback?: number): number {
	const raw =
		process.env[name] ??
		(fallback !== undefined ? String(fallback) : undefined);

	if (raw === undefined || raw === "") {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	const value = Number(raw);

	if (Number.isNaN(value)) {
		throw new Error(`Environment variable ${name} must be a number`);
	}

	return value;
}

function getNodeEnv(name: string, fallback: NodeEnv = "development"): NodeEnv {
	const value = (process.env[name] ?? fallback) as string;

	if (value !== "development" && value !== "test" && value !== "production") {
		throw new Error(
			`Environment variable ${name} must be one of: development, test, production`,
		);
	}

	return value;
}

export const env = {
	NODE_ENV: getNodeEnv("NODE_ENV", "development"),
	PORT: getNumberEnv("PORT", 3000),
	APP_NAME: getEnv("APP_NAME", "node-boilerplate"),
	APP_URL: getEnv("APP_URL", "http://localhost:3000"),
	DATABASE_URL: getEnv("DATABASE_URL"),
	JWT_SECRET: getEnv("JWT_SECRET"),
	FREE_OPENWEATHER_API_KEY: getEnv("FREE_OPENWEATHER_API_KEY"),
	FREE_OPENWEATHER_BASE_URL: getEnv("FREE_OPENWEATHER_BASE_URL"),
	LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
	API_KEY: getEnv("API_KEY", "default-api-key"),
	CORS_ORIGIN: getEnv(
		"CORS_ORIGIN",
		"http://localhost:5173,http://localhost:3000",
	),
} as const;
