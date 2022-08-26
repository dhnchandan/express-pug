import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
	body: object({
		email: string({ required_error: "Email is required." }).email("Email is not valid."),
		username: string({ required_error: "Username is required." }),
		name: string({ required_error: "Name is required." }),
		password: string({ required_error: "Password is required." }).min(6, "Password must be at least 6 characters."),
		passwordConfirmation: string({ required_error: "Password confirmation is required." }),
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: "Passwords must match.",
		path: ["passwordConfirmation"],
	}),
});

export type CreateUserDto = TypeOf<typeof createUserSchema>["body"];
