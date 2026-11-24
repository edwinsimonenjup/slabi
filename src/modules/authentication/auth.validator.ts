import vine from "@vinejs/vine";

export const loginValidator = vine.create({
	email: vine.string().email(),
	password: vine.string(),
});

export const forgotPasswordValidator = vine.create({
	email: vine.string().email(),
});

export const resetPasswordValidator = vine.create({
	token: vine.string(),
	new_password: vine.string().minLength(8),
});

export const refreshTokenValidator = vine.create({
	refresh_token: vine.string(),
});

export const registerValidator = vine.create({
	email: vine.string().email(),
	password: vine.string().minLength(8),
	fullName: vine.string().trim().minLength(1),
	settings: vine.string(),
});
