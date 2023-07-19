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
    "w-full h-fit",
    "grid lg:grid-cols-4 md:grid-cols-2",
    "gap-4 p-4",
    "overflow-y-auto"
  ),
  label: tw(
    "w-full max-w-[80%] mx-auto",
    "text-center text-2xl font-bold",
    "animate-fadeIn"
  )
}

export default function App() {  
  const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);
  const [room, setRoom] = useRoom();

  const [hasSocket, setHasSocket] = useState(false);

  useEffect(() => {
    if(!socket.connected) socket.connect();
    function checkForSocket() {
      if(socket.connected) setHasSocket(true);
      else setTimeout(checkForSocket, 100);
    }
    checkForSocket();
  }, []);

  useEffect(() => {
    socket.on("room-updated", (newRoom: Room) => {
      setRoom(newRoom);
    });
    (async () => {
      const res = await fetch("https://sequence-api-37tv5vdgia-ue.a.run.app/rooms", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
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

    <div className="flex-auto flex-shrink-0 w-full py-8">
      {
        hasSocket
        ? <div className="flex flex-col mx-auto w-full">
          {/* Has not joined game (create prompt and public games) */}
          {!room.id && <>
            <p className={styles.label}>Create a room and share the ID with a friend.</p>
            {foundRoomIDs.length > 0 && <p className={styles.label}>Or, pick a room from the list.</p>}
            <div className={styles.foundRoomContainer}>
              {foundRoomIDs.map(id => <PublicRoom key={id} roomID={id} />)}
            </div>
          </>}

          {/* Waiting for player */}
          {room.users.length < 2 && room.id && <>
            <div className="flex items-center justify-center animate-fadeIn">
              <Styled.Spinner />
              <span className="mx-4 animate-pulse text-3xl">Waiting for a partner...</span>
            </div>
          </>}
          
          {/* Lobby full, waiting to start */}
          {room.gameState === "lobby" && room.users.length === 2 && <>
            <div className="animate-fadeIn">
              <p className={styles.label}>You're ready to start!</p>
              <p className={styles.label}>Press the Begin Game button above.</p>
            </div>
          </>}
          
          {/* Game in progress (or finished) */}
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
        // Waiting to connect to server
        : <div className="flex flex-col items-center justify-center h-full">
          <div className="flex space-x-4 opacity-0 animation-delay-500 animate-fadeIn">
            <Styled.Spinner />
            <div>
              <p className="animate-pulse text-3xl">Waiting for server...</p>
              <p className="text-md text-stone-500 opacity-0 animate-fadeIn animation-delay-[6000ms]">If this is taking too long, try refreshing the page.</p>
              <p className="text-md text-stone-500 opacity-0 animate-fadeIn animation-delay-[10000ms]">Or something's broken... contact me?</p>
            </div>
          </div>
        </div>
      }
    </div>

    <Footer />
  </> );
}
