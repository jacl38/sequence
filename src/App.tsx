import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

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

  return (
    <div>


      {/* <p>client id: {socket?.id}</p>

      <button onClick={() => socket?.emit("get-room-ids")}>
        test get rooms
      </button>

      <input
        className="border-gray-300 py-1 px-1.5 border-2 rounded-lg"
        type="text"
        placeholder="Enter a room ID"
        onKeyDown={e => {
          if(e.key === "Enter") {
            socket?.emit("message", e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />

      <button
        className="border-gray-300 py-1 px-1.5 border-2 rounded-lg"
        onClick={() => {
          socket?.emit("create-room");
        }}>
        Create a room
      </button>
      <div>
        Rooms list:
        <ul>
          {foundRoomIDs.map((roomID, i) => (
            <div key={`room-${i}`}>
              <button>Room {roomID}</button>
            </div>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
