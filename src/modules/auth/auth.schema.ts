import { object, string, TypeOf } from "zod";

export const loginSchema = object({
	body: object({
		username: string({ required_error: "Username is required." }),
		password: string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
	}),
});

export type LoginDto = TypeOf<typeof loginSchema>["body"];
