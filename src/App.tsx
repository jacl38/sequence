import { useEffect } from "react";
import Header from "./Components/Header";
import { useRoom } from "./store/store";
import Styled from "./util/styled";
import socket from "./socket";
import { Room } from "./store/types";

export default function App() {  
  // const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);
  const [room, setRoom] = useRoom();

  useEffect(() => {
    socket.on("room-updated", (newRoom: Room) => {
      setRoom(newRoom);
    });
  }, [room]);

  return ( <>
    <Header />

    {JSON.stringify(room.users)}
    {JSON.stringify(room.id)}

    {room.users.length < 2 && room.id && <>
      <div className="flex flex-auto items-center justify-center text-3xl animate-fadeIn">
        <Styled.Spinner />
        <span className="mx-4 animate-pulse">Waiting for partner...</span>
      </div>
    </>}
  </> );
}
