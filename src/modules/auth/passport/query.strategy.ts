import config from "config";
import JwtStrategy, { ExtractJwt, StrategyOptions, VerifiedCallback } from "passport-jwt";
import log from "@providers/logger.provider";
import usersService from "@modules/users/user.services";
import { IJwtPayload } from "@common/types/jwt.types";

const options: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromUrlQueryParameter("token"),
	secretOrKey: Buffer.from(config.get<string>("public_key"), "base64").toString("ascii"),
	algorithms: ["RS256"],
};

const queryStrategy = new JwtStrategy.Strategy(
	options,
	async (jwtPayload: IJwtPayload, done: VerifiedCallback): Promise<void> => {
		log.info(`[jwt payload] ${JSON.stringify(jwtPayload)}`);

		const user = await usersService.findUserById(jwtPayload.sub);

		if (user) {
			// Since we are here, the JWT is valid and our user is valid, so we are authorized!
			return done(null, user);
		} else {
			return done(null, false, { message: "Invalid jwt." });
		}
	},
);

export default queryStrategy;
