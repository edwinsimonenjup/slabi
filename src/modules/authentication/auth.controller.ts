import type { Request, Response } from "express";
import AuthService from "./auth.service";

const service = new AuthService();

export default class AuthController {
	async login(req: Request, res: Response) {
		const { email, password } = req.body;
		const data = await service.login(email, password);
		return res.status(200).json({
			success: "string",
			message: "Login successful",
			data,
		});
	}

	async forgot_password(req: Request, res: Response) {
		const { email } = req.body;
		const data = await service.forgot_password(email);
		return res.status(200).json({
			success: true,
			message: "If that email exists, a reset link has been sent",
			data,
		});
	}

	async reset_password(req: Request, res: Response) {
		const { token, new_password } = req.body;
		const data = await service.reset_password(token, new_password);
		return res.status(200).json({
			success: "Password reset successful",
			data,
		});
	}

	async refresh_token(req: Request, res: Response) {
		const { refresh_token } = req.body;
		const data = await service.refresh_token(refresh_token);
		return res
			.status(200)
			.json({ success: true, message: "Token refreshed", data });
	}

	async register_user(req: Request, res: Response) {
		const { email, password, fullName, settings } = req.body;
		const data = await service.register_user({
			email,
			fullName,
			password,
			settings,
		});
		return res
			.status(201)
			.json({ success: true, message: "Registration successful", data });
	}
}
