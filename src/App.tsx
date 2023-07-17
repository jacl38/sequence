import { useEffect, useState } from "react";
import Header from "./Components/Header";
import { useRoom } from "./store/store";
import Styled, { tw } from "./util/styled";
import socket from "./socket";
import { Room } from "./store/types";
import Card from "./Components/Board/Card";
import PublicRoom from "./Components/PublicRoom";

export default function App() {  
  const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);
  const [room, setRoom] = useRoom();

  useEffect(() => {
    socket.on("room-updated", (newRoom: Room) => {
      setRoom(newRoom);
    });
  }, [room]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      setFoundRoomIDs(data.rooms);
    })();
  }, );

  return ( <>
    <Header />

    {!room.id && <>
      <div className={tw(
        "grid lg:grid-cols-4 md:grid-cols-2 gap-4 p-4 overflow-y-auto",
      )}>
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
      <div className="relative">
        <Card cardType={{ suit: "diamonds", value: "four" }} chip={{ color: "empty" }} />
        <Card cardType={{ suit: "spades", value: "ace" }} chip={{ color: "empty" }} />
        <Card cardType={{ suit: "wild", value: "wild" }} chip={{ color: "empty" }} />
      </div>
    </>}
  </> );
}
