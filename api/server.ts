import express from "express";
import { Server, Socket } from "socket.io"
import { UUID } from "./util";
import { Room } from "./types";
import { makeBoard } from "./boardUtil";

const app = express();
const server = app.listen(3000);

const io = new Server(server, { cors: { origin: "*" } });

const rooms: Room[] = [];
const clients: Socket[] = [];

function getClientByID(id: string) {
  return clients.find(client => client.id === id);
}

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

  socket.on("create-room", (callback: (id?: string) => void) => {

    // check if user is already in a room
    // if so, delete that room
    if(rooms.some(room => room.users.includes(socket.id))) {
      rooms.splice(rooms.findIndex(room => room.users.includes(socket.id)), 1);
    }

    const newRoom: Room = {
      id: UUID(),
      public: false,
      users: [socket.id],
      gameState: "lobby",
      board: makeBoard()
    };
    rooms.push(newRoom);
    console.log(`Created room ${newRoom.id} and added ${socket.id} to it.`);
    socket.emit("room-updated", newRoom);
    callback(newRoom.id);
  });

  socket.on("set-public", (isPublic: boolean) => {
    const room = rooms.find(room => room.users.includes(socket.id));
    if(room) {
      room.public = isPublic;
      room.users.forEach(user => {
        getClientByID(user)?.emit("room-updated", room);
      });
    }
  });

  socket.on("join-room", (roomId: string, callback: (success: boolean) => void) => {
    console.log(`${socket.id} is trying to join room ${roomId}.`);
    const room = rooms.find(room => room.id === roomId);
    if(room && !room.users.includes(socket.id) && room.users.length < 2) {
      room.users.push(socket.id);
      console.log(`Added ${socket.id} to room ${roomId}.`);
      socket.emit("entered-room", room);

      room.users.forEach(user => {
        getClientByID(user)?.emit("room-updated", room);
      });

      callback(true);
    } else {
      callback(false);
    }
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