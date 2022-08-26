import dotenv from "dotenv";
dotenv.config(); // Must be loaded before other imports
import express, { Application } from "express";
import "module-alias/register";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import config from "config";
import passport from "passport";
import log from "@providers/logger.provider";
import connectMongo from "@providers/mongo/mongo.provider";
import router from "./routes";
import { errorHandler } from "@middlewares/.";
import passportAuth from "@modules/auth/passport/auth.config";
import { createServer, Server } from "http";
import { Websocket } from "./socket";
import authSocket from "@modules/auth/auth.socket";
import { SOCKET_PATHS } from "@common/const/socket.const";
import mongoStrategy1 from "@providers/mongo/mongo.s1.provider";
import mongoStrategy2 from "@providers/mongo/mongo.s2.provider";

class App {
	public app: Application;
	public server: Server;
	public io: Websocket;
	public port: number | string;

	public constructor() {
		this.app = express();
		this.server = createServer(this.app);
		this.io = Websocket.getInstance(this.server);
		this.port = config.get<number>("port");

		this.initializeDatabaseConnections().catch((error) => console.error(error));
		this.initializeMiddlewares();
		this.initializeRoutes();
		this.initializeErrorHandling();
		this.initializeSocketHandlers();
	}

	public listen = (): void => {
		// We are now listening server instead of app
		this.server.listen(this.port, () => {
			log.info(`=========================================`);
			log.info(`Server started on port ${this.port}`);
			log.info(`=========================================`);
		});
	};

	private initializeDatabaseConnections = async (): Promise<void> => {
		// await connectMongo();
		// mongoStrategy1.initializingS1().catch((error) => {
		// 	log.error("[mongo s1] Error in initializing mongo s1");
		// 	log.error(error);
		// });
		mongoStrategy2.initializingS2().catch((error) => {
			log.error("[mongo s2] Error in initializing mongo s2");
			log.error(error);
		});
	};

	private initializeMiddlewares = (): void => {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		// Enable CORS
		this.app.use(
			cors({
				origin: "*",
			}),
		);
		this.app.use(hpp());
		this.app.use(helmet());
		this.app.use(compression());
		this.app.use(cookieParser());
		// Initialize passport
		this.app.use(passport.initialize());
		passportAuth(passport);
	};

	private initializeRoutes = (): void => {
		this.app.use(router);
	};

	private initializeErrorHandling = (): void => {
		// Error handler. Must be placed at the end of the middleware chain.
		this.app.use(errorHandler);
	};

	private initializeSocketHandlers = (): void => {
		this.io.initializeHandlers([{ path: `/${SOCKET_PATHS.AUTH}`, handler: authSocket }]);
	};
}

const app = new App();
app.listen();
