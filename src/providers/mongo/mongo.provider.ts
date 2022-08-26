import mongoose from "mongoose";
import config from "config";
import log from "@providers/logger.provider";

const mongo_url = config.get<string>("mongo_url");

const run = async (): Promise<void> => {
	const options: mongoose.ConnectOptions = {
		keepAlive: true,
		socketTimeoutMS: 3000,
		connectTimeoutMS: 3000,
	};

	await mongoose.connect(mongo_url, options);
};

async function connectMongo(): Promise<void> {
	const connection = mongoose.connection;
	connection.on("connected", () => {
		log.info("[mongo] Mongo connection established");
	});
	connection.on("reconnected", () => {
		log.info("[mongo] Mongo connection reestablished");
	});
	connection.on("disconnected", () => {
		log.info("[mongo] Mongo connection disconnected");
		log.info("[mongo] Trying to reconnect to Mongo ...");
		setTimeout(async () => {
			await run();
		}, 3000);
	});
	connection.on("close", () => {
		log.info("[mongo] Mongo connection closed");
	});
	connection.on("error", (error: Error) => {
		log.error("[mongo] Mongo connection error: " + error);
	});

	try {
		await run();
	} catch (err) {
		log.error(err);
		process.exit(1);
	}
}

export default connectMongo;
