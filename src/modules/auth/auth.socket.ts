import { Socket } from "socket.io";
import { ISocket } from "@common/types/socket.types";
import log from "@providers/logger.provider";
import authService from "@modules/auth/auth.services";
import { IJwtPayload } from "@common/types/jwt.types";

export class AuthSocket implements ISocket {
	public handleConnection = (socket: Socket): void => {
		log.info("[auth] Socket connected");
		log.info("[socket] connection id: " + socket.id);
		// log.info(socket.handshake)
		socket.emit("auth_ping", { message: "Welcome to the auth socket" });

		socket.on("client_ping", (data: string) => {
			log.info("[socket] Client pinged");
			log.info(data);
		});
	};

	public middlewareImplementation = (socket: Socket, next: (e?: Error) => void): void => {
		// Implement middleware for auth here
		const auth_header = socket.handshake.headers.authorization;

		if (auth_header) {
			const payload: IJwtPayload | undefined = authService.verifyToken(auth_header);

			if (payload) {
				next();
			} else {
				log.error("[socket] Not authorized");
				next(new Error("Not authorized"));
				socket.disconnect();
			}
		} else {
			log.error("[socket] Authorization header not found");
			next(new Error("Authorization header not found"));
			socket.disconnect();
		}
	};
}

const authSocket = new AuthSocket();

export default authSocket;
