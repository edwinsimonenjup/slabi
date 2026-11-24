import { readFileSync } from "node:fs";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { parse } from "yaml";
import { env } from "./config/env";
import { requireApiKey } from "./middlewares/api-key.middleware";
import { requireAuth } from "./middlewares/auth.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import authRoutes from "./modules/authentication/auth.routes";
import healthRoutes from "./modules/health/health.routes";
import weatherRoutes from "./modules/weather/weather.routes";

const app = express();

//1.  Secure the app with Helmet (disable CSP for Swagger UI)
app.use("/docs", helmet({ contentSecurityPolicy: false }));
app.use(helmet());

// 2. Dynamic CORS allowlist from .env (comma-separated)
const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) =>
	origin.trim(),
);

app.use(
	cors({
		origin: allowedOrigins,
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
	}),
);

//3. Middleware and routes
app.use("/health", healthRoutes);

//4. Middleware for parsing JSON and logging requests
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

//5. Swagger UI setup and API routes
const openapiDocument = parse(readFileSync("./src/docs/openapi.yaml", "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/weather", requireApiKey, weatherRoutes);

app.get("/api/v1/whoami", requireAuth, (req, res) => {
	res.json({ userId: req.user?.id });
});

app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;
