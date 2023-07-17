import { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import { useRoom } from "./store/store";
import Styled, { tw } from "./util/styled";
import socket from "./socket";
import { Room } from "./store/types";
import PublicRoom from "./Components/PublicRoom";
import Footer from "./Components/Footer";
import PlayArea from "./Components/PlayArea";
import WinLoseIndicator from "./Components/WinLoseIndicator";

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
      console.log(newRoom.myHand);
      setRoom(newRoom);
    });
    (async () => {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setFoundRoomIDs(data.rooms);
    })();
  }, [room]);

  const myColor = room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple";
  const whoWon = room.gameState.split("-")[1] as "green" | "purple" | "tie";
  const winState = whoWon === myColor ? "win" : whoWon === "tie" ? "tie" : "lose";

  const [showWinLoseIndicator, setShowWinLoseIndicator] = useState(true);

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
        {room.gameState.split("-")[0] === "end" && showWinLoseIndicator && <>
          <WinLoseIndicator
            winState={winState}
            onRestart={() => socket.emit("begin-game")}
            onClose={() => setShowWinLoseIndicator(false)} />
        </>}
        <PlayArea />
      </>}
    </div>

    <Footer />
  </> );
}
