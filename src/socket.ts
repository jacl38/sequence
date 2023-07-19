import { io } from "socket.io-client";

const socket = io("https://sequence-api-37tv5vdgia-ue.a.run.app");

setInterval(() => {
  socket.emit("test-message", () => {});
}, 8000);

export default socket;