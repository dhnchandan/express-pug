import { Router } from "express";
import authRoutes from "@modules/auth/auth.routes";
import usersRouter from "@modules/users/user.routes";
import { apiVersion } from "@utils/consts";

class RootRoutes {
	public router: Router;

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes(): void {
		this.router.get("/", (_, res) => res.status(200).send(`Express SaaS app. API version V1.`));

		// Health check
		this.router.get("/health", (_, res) => res.status(200).send("OK"));

		// Test global error handling
		this.router.get("/error", (_, res) => {
			throw new Error("Raise some error.");

			res.status(200).send(`API version ${apiVersion}`);
		});

		// Module apis
		this.router.use(`${apiVersion}/auth`, authRoutes);
		this.router.use(`${apiVersion}/users`, usersRouter);

		// Catch all unmatched routes
		this.router.all("*", (_, res) => res.status(404).send("Route not found"));
	}
}

const rootRoutes: RootRoutes = new RootRoutes();

export default rootRoutes.router;
