import express from "express";
import { Server, Socket } from "socket.io"
import { UUID } from "./util";
import { BoardSpace, CardSuits, CardValues, Hand, Room } from "./types";
import { cardCanBePlayed, findWinCondition, makeBoard, validateAction } from "./boardUtil";
import { shuffle } from "./mathUtil";

const app = express();
const server = app.listen(3000);

const io = new Server(server, { cors: { origin: "*" } });

const rooms: ({
  hands?: { [key: string]: Hand },
  remainingCards?: Hand
} & Omit<Room, "myHand">)[] = [];
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
    const foundRoom = rooms.find(room => room.users.includes(socket.id));
    return foundRoom;
  }

  function signalChange() {
    const room = getRoom();
    if(!room) return;
    room.users.forEach(user => {
      const filteredRoom = {...room};
      // removing secret data (other user's hand, cards left in the deck)
      delete filteredRoom.hands;
      delete filteredRoom.remainingCards;
      const usersHand = room.hands?.[user];
      getClientByID(user)?.emit("room-updated", { ...filteredRoom, myHand: usersHand });
    });
  }

  socket.on("test-message", data => {
    console.log("got pinged by", socket.id);
    data({ test: "asdf" });
  });

  socket.on("create-room", (callback: (id?: string) => void) => {
    // check if user is already in a room
    // if so, remove them from that room
    const room = getRoom();
    if(room) room.users.splice(room.users.indexOf(socket.id), 1);

    const newRoom: typeof rooms[number] = {
      id: UUID(),
      public: false,
      users: [socket.id],
      hands: {
        [socket.id]: []
      },
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
    room.gameState = "turn-green";

    // make deck
    let deck: BoardSpace[] = [];
    CardSuits.forEach(suit => {
      if(suit === "wild") return;
      CardValues.forEach(value => {
        if(value === "wild") return;
        deck.push({ suit, value }, { suit, value });
      });
    });

    // shuffle deck
    deck = shuffle(deck);

    // deal cards
    room.users.forEach(user => {
      room.hands![user] = [];
      for(let i = 0; i < 7; i++) {
        room.hands![user].push(deck.pop()!);
      }
    });

    // set remaining cards
    room.remainingCards = deck;
    signalChange();
  });

  socket.on("suggest-change", (position: { row: number, col: number }) => {
    const room = getRoom();
    if(!room) {
      alert("You are not in a room.\nYou might need to refresh the page and try again.");
      return;
    }
    if(room.gameState !== "turn-green" && room.gameState !== "turn-purple") return; // not in a match state right now

    const myColor = room.users.findIndex(user => user === socket.id) === 0 ? "green" : "purple";

    const turnColor = room.gameState.split("-")[1];

    if(myColor !== turnColor) return; // not your turn

    const hand = room.hands![socket.id];

    const validity = validateAction({
      position,
      board: room.board,
      myColor,
      hand
    });

    if(validity !== undefined) { // completely valid action
      const card = hand[validity];
      room.hands![socket.id].splice(validity, 1);

      // if it's a one-eyed jack, remove the selected chip from the board
      if((card.suit === "spades" || card.suit === "clubs") && card.value === "jack") {
        room.board[position.row][position.col].chip.color = "empty";
      } else {
        // otherwise, place the chip
        room.board[position.row][position.col].chip.color = myColor;
      }

      // check win condition
      const win = findWinCondition(room.board);
      console.log(win);

      if(win !== "empty") {
        room.gameState = `end-${win}`;
        signalChange();
        return;
      }

      // give user more cards
      const deck = room.remainingCards!;
      for(let i = 0; i < 7 - room.hands![socket.id].length; i++) {
        let card = deck.pop();
        if(card === undefined) break;

        // check if the drawn card has any valid placements
        // get a new one if not
        while(!cardCanBePlayed({ card, board: room.board, myColor })) {
          card = deck.pop();
          if(card === undefined) break;
        }
        if(card !== undefined) room.hands![socket.id].push(card);
      }

      // check tie/forfeit condition
      const hasValidMoves = room.users.map((user, c) => {
        const myColor = c === 0 ? "green" : "purple";
        return room.hands![user].some(card => cardCanBePlayed({ card, board: room.board, myColor }));
      });

      // neither player has valid moves -> tie
      if(!hasValidMoves[0] && !hasValidMoves[1]) {
        room.gameState = "end-tie";
        signalChange();
        return;
      }

      // green player has no valid moves when about to switch to their turn -> purple wins
      if(!hasValidMoves[0] && socket.id !== room.users[0]) {
        room.gameState = "end-purple";
        signalChange();
        return;
      }

      // purple player has no valid moves when about to switch to their turn -> green wins
      if(!hasValidMoves[1] && socket.id !== room.users[1]) {
        room.gameState = "end-green";
        signalChange();
        return;
      }

      // otherwise, pass the turn
      room.gameState = `turn-${myColor === "green" ? "purple" : "green"}`;
      signalChange();
    }
  });

  socket.on("join-room", (roomId: string, callback: (status: "success" | "full" | "not-found") => void) => {
    console.log(`${socket.id} is trying to join room ${roomId}.`);
    const room = rooms.find(room => room.id === roomId);
    if(room && !room.users.some(user => user === socket.id) && room.users.length < 2) {
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
      const index = room.users.findIndex(user => user === socket.id);
      room.users.splice(index, 1);
      if(room.users.length === 0) {
        // remove room entirely if no users are left
        rooms.splice(rooms.indexOf(room), 1);
      }
      room.gameState = "lobby";
      room.board = makeBoard();
    }
    room?.users.forEach(user => {
      getClientByID(user)?.emit("room-updated", room);
    });
    clients.splice(clients.indexOf(socket), 1);
  });
});