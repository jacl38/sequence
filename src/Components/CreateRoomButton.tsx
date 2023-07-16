import socket from "../socket"
import styled from "../util/styled"

export default function CreateRoomButton() {
  function createRoom() {
    socket.emit("create-room")
  }

  return <styled.Button
    onClick={createRoom}>
    Create Room
  </styled.Button>
}