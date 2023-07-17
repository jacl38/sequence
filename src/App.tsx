import { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import { useRoom } from "./store/store";
import Styled, { tw } from "./util/styled";
import socket from "./socket";
import { Room } from "./store/types";
import PublicRoom from "./Components/PublicRoom";
import Board from "./Components/Board/Board";
import Footer from "./Components/Footer";

const styles = {
  foundRoomContainer: tw(
    "grid lg:grid-cols-4 md:grid-cols-2",
    "gap-4 p-4",
    "overflow-y-auto"
  )
}

export default function App() {  
  const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);
  const [room, setRoom] = useRoom();

  useEffect(() => {
    socket.on("room-updated", (newRoom: Room) => {
      setRoom(newRoom);
    });
    (async () => {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setFoundRoomIDs(data.rooms);
    })();
  }, [room]);

  return ( <>
    <Header />

    <div className="flex-auto flex">
      {!room.id && <>
        <div className={styles.foundRoomContainer}>
          {foundRoomIDs.map(id => <PublicRoom key={id} roomID={id} />)}
        </div>
      </>}

      {room.users.length < 2 && room.id && <>
        <div className="flex flex-auto items-center justify-center text-3xl animate-fadeIn">
          <Styled.Spinner />
          <span className="mx-4 animate-pulse">Waiting for a partner...</span>
        </div>
      </>}

      {room.gameState !== "lobby" && <>
        <Board />
      </>}
    </div>

    <Footer />
  </> );
}
