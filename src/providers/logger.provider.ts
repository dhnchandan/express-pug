import logger from "pino";
import config from "config";
import dayjs from "dayjs";

const log_level = config.get<string>("log_level");

const log = logger({
	transport: {
		target: "pino-pretty",
	},
	level: log_level,
	base: {
		pid: false,
	},
	timestamp: () => `,"time": "${dayjs().format("MM-DD HH:mm:ss")}"`,
});

export default log;
