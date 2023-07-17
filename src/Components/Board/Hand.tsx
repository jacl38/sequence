import { useEffect, useState } from "react";
import { useRoom } from "../../store/store";
import socket from "../../socket";
import { BoardSpace, Hand } from "../../store/types";
import { tw } from "../../util/styled";
import Card from "./Card";

const styles = {
  container: (color: "green" | "purple") => tw(
    "flex flex-col",
    "items-center justify-center",
    "space-y-1.5 px-2 mx-2 pb-4 pt-2",
    color === "green" ? "bg-green-400 border-green-500 dark:bg-green-600 dark:border-green-700" : "",
    color === "purple" ? "bg-purple-400 border-purple-500 dark:bg-purple-600 dark:border-purple-700" : "",
    "transition-colors",
    "border-4 rounded-2xl"
  ),
  label: tw(
    "text-xl font-bold",
    "select-none"
  )
}

type HandProps = {
  onHover?: (card?: number) => void,
  onExit?: () => void
}

export default function Hand({ onHover, onExit }: HandProps) {
  const [room,] = useRoom();
  const [hand, setHand] = useState<Hand>([]);

  const color = room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple";

  useEffect(() => {
    setHand(room.myHand);
  }, []);

  return (<>
    <div className={styles.container(color)}>
      <p className={styles.label}>Hand</p>
      {hand?.map((card, i) => (
        <Card
          onHover={() => onHover?.(i)}
          onExit={onExit}
          key={`hand-${i}`}
          cardType={card}
          chip={{ color: "empty" }} />
      ))}
    </div>
  </>);
}