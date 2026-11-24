import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import AuthController from "./auth.controller";
import {
	forgotPasswordValidator,
	loginValidator,
	refreshTokenValidator,
	registerValidator,
	resetPasswordValidator,
} from "./auth.validator";

const router = Router();
const controller = new AuthController();

router.post(
	"/login",
	validate(loginValidator),
	controller.login.bind(controller),
);
router.post(
	"/forgot-password",
	validate(forgotPasswordValidator),
	controller.forgot_password.bind(controller),
);
router.post(
	"/reset-password",
	validate(resetPasswordValidator),
	controller.reset_password.bind(controller),
);
router.post(
	"/refresh",
	validate(refreshTokenValidator),
	controller.refresh_token.bind(controller),
);
router.post(
	"/register",
	validate(registerValidator),
	controller.register_user.bind(controller),
);

export default router;
