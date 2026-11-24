// src/utils/jwt.ts
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
	userId: string;
	type: "access" | "refresh";
}

export function signToken(
	payload: TokenPayload,
	expiresIn: SignOptions["expiresIn"],
): string {
	return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

export function verifyToken(
	token: string,
	expectedType: "access" | "refresh" = "access",
): TokenPayload {
	const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

	if (decoded.type !== expectedType) {
		throw new Error(
			`Expected a ${expectedType} token, got a ${decoded.type} token`,
		);
	}

	return decoded;
}
