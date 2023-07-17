import Styled from "../util/styled";
import { useRoom } from "../store/store";
import socket from "../socket";

export default function BeginButton() {

  const [room,] = useRoom();

  function begin() {
    socket.emit("begin-game");
  }

  return (
    <Styled.Button
      onClick={begin}
      disabled={room.users.length < 2}>
      Begin Game
    </Styled.Button>
  );
}