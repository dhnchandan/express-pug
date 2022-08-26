export interface IJwtObject {
	token: string;
	expires: string;
}

export interface IJwtPayload {
	sub: string;
	username: string;
	email: string;
	name: string;
	iat: number;
	issuer: string;
	audience: string;
}
