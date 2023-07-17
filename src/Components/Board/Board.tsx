import { useRoom } from "../../store/store";
import { tw } from "../../util/styled";
import Card from "./Card";

const styles = {
  container: tw(
    "flex flex-col space-y-0.5 p-1",
    "max-w-full"
  ),
  row: tw(
    "flex space-x-0.5"
  )
}

export default function Board({ hoveredHandCard }: { hoveredHandCard?: number }) {
  const [room,] = useRoom();

  const hoveredCard = hoveredHandCard !== undefined ? room.myHand[hoveredHandCard] : undefined;

  return (
    <div className={styles.container}>
      {room.board.map((row, i) => {
        return <div key={`row-${i}`} className={styles.row}>
          {row.map((card, j) => {
            return <Card
              hoveredFromHand={hoveredCard?.suit === card.space.suit && hoveredCard?.value === card.space.value}
              key={`card-${i}-${j}`}
              cardType={card.space}
              chip={card.chip} />
          })}
        </div>
      })}
    </div>
  );
}