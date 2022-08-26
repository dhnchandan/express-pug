import LocalStrategy from "passport-local";
import usersService from "@modules/users/user.services";
import log from "@providers/logger.provider";

const localStrategy = new LocalStrategy.Strategy({ usernameField: "username" }, async (username, password, done) => {
	log.info("[passport] local strategy", username, password);

	try {
		// Find user by username
		const user = await usersService.findUserByUsername(username);

		if (!user) {
			return done(null, false, { message: `username ${username} not found.` });
		}

		// Verify password
		const isValid = await usersService.verifyUserPassword(user.password, password);

		if (!isValid) {
			return done(null, false, { message: "Invalid username or password." });
		}

		// Return user
		return done(null, user, { message: "Logged in Successfully" });
	} catch (error) {
		log.error(error, "Could not login user");
		done(error);
	}
});

export default localStrategy;
