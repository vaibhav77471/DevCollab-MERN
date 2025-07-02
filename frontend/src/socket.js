import { io } from "socket.io-client";

const URL = "http://localhost:5000"; // backend server
export const socket = io(URL, {
  transports: ['websocket'],
});
