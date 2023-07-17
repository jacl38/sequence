import { useRoom } from "../../store/store";
import { tw } from "../../util/styled";
import Card from "./Card";

const styles = {
  container: tw(
    "flex flex-col space-y-0.5"
  ),
  row: tw(
    "flex space-x-0.5"
  )
}

export default function Board() {
  const [room,] = useRoom();

  return (
    <div className={styles.container}>
      {room.board.map((row, i) => {
        return <div className={styles.row}>
          {row.map((card, j) => {
            return <Card cardType={card.space} chip={card.chip} />
          })}
        </div>
      })}
    </div>
  );
}