import socket from "../../socket";
import { useRoom } from "../../store/store";
import { BoardSpace, Chip } from "../../store/types";
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

function isOneEyedJack(card: BoardSpace) {
  if(card.value !== "jack") return false;
  return card.suit === "spades" || card.suit === "clubs";
}

function isTwoEyedJack(card: BoardSpace) {
  if(card.value !== "jack") return false;
  return card.suit === "hearts" || card.suit === "diamonds";
}

export default function Board({ hoveredHandCard }: { hoveredHandCard?: number }) {
  const [room,] = useRoom();

  const hoveredCard = hoveredHandCard !== undefined ? room.myHand[hoveredHandCard] : undefined;

  const myColor = room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple";

  function onCardClick(position: { row: number, col: number }) {
    socket.emit("suggest-change", position);
  }

  function checkPlacementSuggestion(row: number, col: number, card: { chip: Chip, space: BoardSpace }) {
    if(!hoveredCard) return false;
    if(row === 0 && col === 0) return false;
    if(row === 9 && col === 0) return false;
    if(row === 0 && col === 9) return false;
    if(row === 9 && col === 9) return false;

    if(isTwoEyedJack(hoveredCard) && card.chip.color === "empty") return true;

    const oppositeColor = myColor === "green" ? "purple" : "green";
    if(isOneEyedJack(hoveredCard) && card.chip.color === oppositeColor) return true;

    if(hoveredCard.suit === card.space.suit && hoveredCard.value === card.space.value) return true;
    return false;
  }

  return (
    <div className={styles.container}>
      {room.board.map((row, i) => {
        return <div key={`row-${i}`} className={styles.row}>
          {row.map((card, j) => {
            return <Card
              onClick={() => onCardClick({ row: i, col: j })}
              hoveredFromHand={checkPlacementSuggestion(i, j, card)}
              key={`card-${i}-${j}`}
              cardType={card.space}
              chip={card.chip} />
          })}
        </div>
      })}
    </div>
  );
}