import Styled from "../util/styled";
import { useRoom } from "../store/store";

export default function BeginButton() {

  const [room,] = useRoom();

  return (
    <Styled.Button disabled={room.users.length < 2}>
      Begin Game
    </Styled.Button>
  );
}