import socket from "../socket";
import { isValidRoomID } from "../util/room";
import Styled from "../util/styled"

type PublicRoomProps = {
  roomID: string
}

export default function PublicRoom({ roomID }: PublicRoomProps) {

  function joinRoom() {
    if(!isValidRoomID(roomID)) return;
    socket.emit("join-room", roomID, (status: "success" | "full" | "not-found") => {
      if(status === "success") return;
      if(status === "full") alert("Couldn't join room: Room is full.")
      if(status === "not-found") alert("Couldn't join room: Room not found. Check the Room ID and try again.");
    });
  }

  return (
    <Styled.Button
      onClick={joinRoom}>
      {roomID}
    </Styled.Button>
  )
}