export type loginDTO = {
	type: string;
	token: string;
	user: userDTO;
};

export type userDTO = {
	id: string;
	email: string;
	fullName: string;
	username: string;
	roles: string[];
	settings: string;
};

export type registerDTO = {
	email: string;
	password: string;
	fullName: string;
	settings: string;
};

export type forgotPasswordDTO = {
	user: {
		id: string;
		email: string;
		token: string;
	};
};

export type refreshTokenDTO = {
	tokens: {
		accessToken: string;
		refreshToken: string;
		tokenType: string;
		expiresIn: number;
	};
};
