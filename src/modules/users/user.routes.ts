import { Router } from "express";
import { validateResource } from "@middlewares/.";
import usersController, { UsersController } from "./user.controllers";
import { createUserSchema } from "./user.schema";

class UsersRouter {
	public router: Router;
	private usersController: UsersController = usersController;
	private test: string = "User router OK";

	public constructor() {
		this.router = Router();
		this.routes();
	}

	public routes = (): void => {
		this.router.get("/health", (_, res) => res.status(200).send(this.test));

		this.router.post("/", [validateResource(createUserSchema)], this.usersController.createNewUser);
	};
}

const usersRouter = new UsersRouter();

export default usersRouter.router;
