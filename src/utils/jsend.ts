export const jsend = {
	success(data: unknown, message?: string) {
		return {
			status: "success",
			message,
			data,
		};
	},

	fail(data: unknown) {
		return {
			status: "fail",
			data,
		};
	},

	error(message: string, data: unknown = null) {
		return {
			status: "error",
			message,
			data,
		};
	},
};
