import { env } from "./env";

export const appConfig = {
	name: env.APP_NAME,
	env: env.NODE_ENV,
	port: env.PORT,
	url: env.APP_URL,
	isDev: env.NODE_ENV === "development",
	isTest: env.NODE_ENV === "test",
	isProd: env.NODE_ENV === "production",
} as const;

export default appConfig;
