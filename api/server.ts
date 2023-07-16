import express from "express";
import { Server, Socket } from "socket.io"

const app = express();
const server = app.listen(3000);

const io = new Server(server, { cors: { origin: "*" } });

type Room = {
  id: string,
  public: boolean,
  users: string[]
}

const rooms: Room[] = [];
const clients: Socket[] = [];

app.get("/api/rooms", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const data = {
    rooms: rooms.filter(room => room.public).map(room => room.id)
  };
  res.status(200).send(JSON.stringify(data));
});

io.on("connection", socket => {
  clients.push(socket);
  console.log("User connected:", socket.id);

  socket.on("test-message", data => {
    console.log("got pinged by", socket.id);
    data({ test: "asdf" });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clients.splice(clients.indexOf(socket), 1);
  });
});

// Socket events:

// ==Server==
// "create-room" () => void
//   Generates a new room ID
// "join-room" (roomId: string) => void
//   Adds the user to the room
// "leave-room" () => void
//   Removes the user from the room
// "set-public" (isPublic: boolean) => void

// ==Client==
// "room-ids" () => roomIds: string[]
//   Returns a list of room IDs
// "room-users" (roomId: string) => users: string[]
//   Returns a list of users in the room