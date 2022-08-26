import { Socket } from "socket.io";

export interface ISocket {
	handleConnection(socket: Socket): void;
	middlewareImplementation?(socket: Socket, next: () => void): void;
}

export interface ISocketHandler {
	path: string;
	handler: ISocket;
}

export interface ServerToClientEvents {
	no_arg: () => void;
	basic_emit: (a: number, b: string, c: Buffer) => void;
	with_acknowledgement: (d: string, callback: (e: number) => void) => void;
	logged_in: (data: object) => void;
}

export interface ClientToServerEvents {
	client_ping: (a: string) => void;
}

export interface InterServerEvents {
	sse_ping: () => void;
}

export interface SocketData {
	name: string;
	email: string;
}
