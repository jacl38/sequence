import socket from "../../socket";
import Styled from "../../util/styled";

export default function RematchButton() {

  function requestRematch() {
    socket.emit("begin-game");
  }

  return (<>
    <Styled.Button
      className="font-bold"
      onClick={requestRematch}>
      Rematch
    </Styled.Button>
  </>);
}