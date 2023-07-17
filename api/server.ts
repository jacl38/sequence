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

// clean up empty rooms every 10 seconds
setInterval(() => {
  rooms.forEach(room => {
    if(room.users.length === 0) {
      rooms.splice(rooms.indexOf(room), 1);
    }
  });
}, 10000);

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

  function getRoom() {
    return rooms.find(room => room.users.includes(socket.id));
  }

  function signalChange() {
    const room = getRoom();
    if(!room) return;
    room.users.forEach(user => {
      getClientByID(user)?.emit("room-updated", room);
    });
  }

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
    signalChange();
    callback(newRoom.id);
  });

  socket.on("set-public", (isPublic: boolean) => {
    const room = getRoom();
    if(room) {
      room.public = isPublic;
      room.users.forEach(user => {
        getClientByID(user)?.emit("room-updated", room);
      });
    }
  });

  socket.on("begin-game", () => {
    const room = getRoom();
    if(!room) {
      alert("You are not in a room.\nYou might need to refresh the page and try again.");
      return;
    }
    if(room.users.length < 2) {
      alert("You need at least two players to start the game.\nYou might need to refresh the page and try again.");
      return;
    }
    room.gameState = "turn-purple";
    signalChange();
  });

  socket.on("join-room", (roomId: string, callback: (status: "success" | "full" | "not-found") => void) => {
    console.log(`${socket.id} is trying to join room ${roomId}.`);
    const room = rooms.find(room => room.id === roomId);
    if(room && !room.users.includes(socket.id) && room.users.length < 2) {
      room.users.push(socket.id);
      console.log(`Added ${socket.id} to room ${roomId}.`);
      socket.emit("entered-room", room);
      
      signalChange();

      callback("success");
    } else {
      callback(room ? "full" : "not-found");
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const room = getRoom();
    if(room) {
      // remove disconnecting user from room
      room.users.splice(room.users.indexOf(socket.id), 1);
      if(room.users.length === 0) {
        // remove room entirely if no users are left
        rooms.splice(rooms.indexOf(room), 1);
      }
    }
    room?.users.forEach(user => {
      getClientByID(user)?.emit("room-updated", room);
    });
    clients.splice(clients.indexOf(socket), 1);
  });
});