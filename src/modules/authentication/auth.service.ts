import { randomInt } from "node:crypto";
import * as argon2 from "argon2";
import {
	ForbiddenError,
	NotFoundError,
	UnauthorizedError,
} from "../../error/app-error";
import { prisma } from "../../lib/prisma";
import { signToken } from "../../utils/jwt";
import type {
	forgotPasswordDTO,
	loginDTO,
	refreshTokenDTO,
	registerDTO,
	userDTO,
} from "./auth.dto";

export default class AuthService {
	async login(email: string, password: string): Promise<loginDTO> {
		const user = await prisma.user.findUnique({ where: { email: email } });

		if (!user || !(await argon2.verify(user.password, password)))
			throw new UnauthorizedError("Email or password is not correct");

		const accessToken = signToken({ userId: user.id, type: "access" }, "1h");

		return {
			type: "bearer",
			token: accessToken,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				username: user.username,
				roles: [],
				settings: "{setting}",
			},
		};
	}

	async forgot_password(email: string): Promise<forgotPasswordDTO> {
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) throw new NotFoundError("Email not found in the system");

		const OTP_TTL_MS = 10 * 60 * 1000;
		const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");

		//Update User
		const update = await prisma.user.update({
			where: { email: email },
			data: {
				resetToken: otp,
				resetTokenExpiredAt: new Date(Date.now() + OTP_TTL_MS),
				updatedAt: new Date(),
				updatedBy: email,
			},
		});

		return {
			user: {
				id: update.id,
				email: email,
				token: otp,
			},
		};
	}

	async reset_password(token: string, password: string) {
		const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
		const user = await prisma.user.findFirstOrThrow({
			where: { resetToken: token },
		});

		if (await argon2.verify(user.password, password))
			throw new ForbiddenError(
				"Password cannnot be the same as previous password",
			);

		await prisma.user.update({
			where: { email: user.email },
			data: {
				password: passwordHash,
				resetToken: null,
				resetTokenExpiredAt: null,
				updatedAt: new Date(),
				updatedBy: user.email,
			},
		});

		return {
			message: true,
		};
	}

	async refresh_token(_token: string): Promise<refreshTokenDTO> {
		throw new UnauthorizedError("Refresh Token is not yet implemented");
	}

	async register_user(payload: registerDTO): Promise<userDTO> {
		const exist = await prisma.user.findUnique({
			where: { email: payload.email },
		});

		if (exist) throw new NotFoundError("Email already registered");

		const passwordHash = await argon2.hash(payload.password, {
			type: argon2.argon2id,
		});

		const user = await prisma.user.create({
			data: {
				email: payload.email,
				fullName: payload.fullName,
				username: payload.email.split("@")[0],
				password: passwordHash,
				settings: payload.settings,
				active: true,
				createdBy: "self-register",
			},
		});

		return {
			id: user.id,
			email: user.email,
			fullName: user.fullName,
			username: user.username,
			roles: [],
			settings: "",
		};
	}
}
