import vine from "@vinejs/vine";

export const weatherValidator = vine.create({
	location: vine.string().trim().minLength(1),
});
