import { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import { useRoom } from "./store/store";
import Styled, { tw } from "./util/styled";
import socket from "./socket";
import { Room } from "./store/types";
import PublicRoom from "./Components/PublicRoom";
import Board from "./Components/Board/Board";
import Footer from "./Components/Footer";
import Hand from "./Components/Board/Hand";

const styles = {
  foundRoomContainer: tw(
    "grid lg:grid-cols-4 md:grid-cols-2",
    "gap-4 p-4",
    "overflow-y-auto"
  ),
  gameContainer: tw(
    "flex justify-stretch",
    "max-md:flex-col",
    "w-full"
  ),
  leftDiv: tw(
    "flex-auto",
    "flex justify-center md:justify-end items-center",
    "max-md:order-3"
  ),
  rightDiv: tw(
    "flex-auto",
    "flex justify-center md:justify-start items-center"
  ),
  turnIndicator: tw(
    "text-center",
    "text-lg"
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

    <div className="flex-auto flex overflow-x-auto w-full">
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
        <div className={styles.gameContainer}>
          <div className={styles.leftDiv}>asdf</div>
          <div className="flex flex-col items-center pt-3 space-y-2 shrink-0">
            <p className={styles.turnIndicator}>[Turn indicator]</p>
            <Board />
          </div>
          <div className={styles.rightDiv}>
            <Hand />
          </div>
        </div>
      </>}
    </div>

    <Footer />
  </> );
}
