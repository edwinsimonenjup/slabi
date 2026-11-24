import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import WeatherController from "./weather.controller";
import { weatherValidator } from "./weather.validator";

const router = Router();
const controller = new WeatherController();

router.get("/locations", controller.getLocation.bind(controller));
router.post(
	"/details",
	validate(weatherValidator),
	controller.getDetails.bind(controller),
);

export default router;
