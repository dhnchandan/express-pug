import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import {
	ISocketHandler,
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData,
} from "@common/types/socket.types";

const WEBSOCKET_CORS = {
	origin: "*",
	methods: ["GET", "POST"],
};

export class Websocket extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {
	private static io: Websocket;

	public constructor(httpServer: HttpServer) {
		super(httpServer, { cors: WEBSOCKET_CORS });
	}

	public static getInstance(httpServer?: HttpServer): Websocket {
		if (!Websocket.io) {
			Websocket.io = new Websocket(httpServer!);
		}

		return Websocket.io;
	}

	public initializeHandlers = (socketHandlers: Array<ISocketHandler>): void => {
		socketHandlers.forEach((element: ISocketHandler) => {
			const namespace = Websocket.io.of(element.path, (socket: Socket) => {
				element.handler.handleConnection(socket);
			});

			if (element.handler.middlewareImplementation) {
				namespace.use(element.handler.middlewareImplementation);
			}
		});
	};
}
