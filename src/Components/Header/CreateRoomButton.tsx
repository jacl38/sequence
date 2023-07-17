import socket from "../../socket"
import styled from "../../util/styled"

export default function CreateRoomButton() {
  function createRoom() {
    socket.emit("create-room", (id?: string) => {
      if(!id) {
        alert("Failed to create room");
        return;
      }
    });
  }

  return <styled.Button
    onClick={createRoom}>
    Create Room
  </styled.Button>
}