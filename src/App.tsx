import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import Header from "./Components/Header";

type Room = {
  id: string;
  name: string;
  users: string[];
}

export default function App() {
  const [socket, setSocket] = useState<Socket>();
  
  const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);

  useEffect(() => {
    if(!socket) {
      setSocket(io());
    }

    return () => {
      socket?.disconnect();
      
    }
  }, [socket]);

  useEffect(() => {
    if(!socket) return;

    socket.emit("test-message", (response: any) => {
      console.log(response);
    });

    // socket?.on("room-ids", setFoundRoomIDs);
  }, [socket]);

  return ( <>
    <Header
      onJoinRoom={roomID => {
        console.log(roomID);
        socket?.emit("join-room", roomID);
      }}
      setPublic={(isPublic, roomID) => {
        console.log(isPublic, roomID);
      }}
    />
  </> );
}
