import argon2 from "argon2";
import UserModel, { User } from "./user.model";
import { CreateUserDto } from "./user.schema";
import log from "@providers/logger.provider";

export class UsersService {
	public createUser = async (data: CreateUserDto): Promise<User> => {
		log.info("[service] createUser");

		const user = UserModel.create(data);

		return user;
	};

	public findUserById = async (id: string): Promise<User> => {
		log.info("[service] findUserById");

		const user = UserModel.findById(id).orFail().exec();

		log.info("[user] by id " + JSON.stringify(user));

		return user;
	};

	public findUserByUsername = async (username: string): Promise<User | undefined> => {
		log.info("[service] findUserByUsername");

		try {
			const user = await UserModel.findOne({ username: username }).orFail().exec();

			log.info("[user] by username " + JSON.stringify(user));

			return user;
		} catch (error: any) {
			if (error?.type === "DocumentNotFoundError") {
				log.error(error?.query);
			} else {
				log.error(error);
			}
		}
	};

	public verifyUserPassword = async (password: string, userPassword: string): Promise<boolean> => {
		log.info("[service] verifyUserPassword");

		try {
			return await argon2.verify(password, userPassword);
		} catch (error) {
			log.error(error, "Could not verify password");
			return false;
		}
	};
}

const usersService: UsersService = new UsersService();

export default usersService;
