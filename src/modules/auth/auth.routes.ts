import { Router } from "express";
import passport from "passport";
import authController, { AuthController } from "./auth.controllers";

class AuthRouter {
	public router: Router;
	private authController: AuthController = authController;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(200).send("Auth router OK"));

		this.router.get(
			"/protected",
			[passport.authenticate("jwt", { session: false })],
			this.authController.protectedRoute,
		);

		this.router.post("/login", this.authController.authenticateUser);
	};
}

const authRouter = new AuthRouter();

export default authRouter.router;
