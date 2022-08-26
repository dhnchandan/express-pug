import log from "@providers/logger.provider";
import localStrategy from "./local.strategy";
import jwtStrategy from "./jwt.strategy";
import queryStrategy from "./query.strategy";
import { PassportStatic } from "passport";

export default function (passport: PassportStatic): void {
	log.info("[passport] auth config");

	// Implement strategies
	passport.use("local", localStrategy);
	passport.use("jwt", jwtStrategy);
	passport.use("query", queryStrategy);

	//TODO: Facebook
	//TODO: Twitter
	//TODO: Google
}
