//////////////////////////// Direct approach ////////////////////////////

// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

// const socket = io("http://localhost:3050/auth");

// socket.on("connect", () => {
// 	socket.on("auth_ping", (message) => {
// 		console.log(message);
// 	});

// 	socket.on("logged_in", (message) => {
// 		console.log(message);
// 	});

// 	socket.emit("client_ping", "[socket-client] Client ping pong");
// });

/////////////////////////// Namespace approach ///////////////////////////

import { Manager } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

const jwt_token = "1324567890";

const manager = new Manager("http://localhost:3050", {
	reconnectionDelayMax: 10000,
	query: {
		token: jwt_token,
	},
	extraHeaders: {
		Authorization:
			"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmU1YWE0YjI2M2IxNThiMjE4ZDA3NjkiLCJlbWFpbCI6InBocC5jaGFuZGFuMUBnbWFpbC5jb20iLCJuYW1lIjoiREhOIiwiaWF0IjoxNjU5NzQ0ODk3MTE5LCJpc3N1ZXIiOiJncmlkLW1vbWVudGEuY29tIiwiYXVkaWVuY2UiOiJncmlkLW1vbWVudGEuY29tIiwiZXhwIjoxNjU5NzQ0OTgzNTE5fQ.YI-pFulBhdw8Au2p8AEV0JG607rn44tZxGI5KYzaiLGqJ9aScMzqJE6_8Re0fjoTwDJMZV24e8duibyxE5bvIo6TGCctPKj4O521shhQDuuS04Mc5cdUIcp1As6KGtsIs8AvD1DNVBWh5vbfkcOoQ_oGUGgqPWz3vMbFbAHNel5q2OngcpXBhTc-SjXnhwXahgqD_GsQ_u8T8NLuGZV9C9BroUfzapPw2mCiw_hw5NABZaaQgkUxy8S2D42rW6450HianJAr8BbtmApgBpn3vveGVV-UOBaljkZHK32npEFhZbKyLJnu_5-_L8jKvsqxAS5rRUETeSrLxcPNyldGRA",
	},
});

const authSocket = manager.socket("/auth"); // auth namespace

authSocket.on("connect", () => {
	authSocket.on("auth_ping", (message) => {
		console.log(message);
	});

	authSocket.on("logged_in", (message) => {
		console.log(message);
	});

	authSocket.emit("client_ping", "[socket-client] Client ping pong");
});
