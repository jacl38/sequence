import { useRoom } from "../../store/store";
import socket from "../../socket";
import { Hand } from "../../store/types";
import { tw } from "../../util/styled";
import Card from "./Card";

const styles = {
  container: (color: "green" | "purple") => tw(
    color === "green" ? "bg-green-400 border-green-500 dark:bg-green-600 dark:border-green-700" : "",
    color === "purple" ? "bg-purple-400 border-purple-500 dark:bg-purple-600 dark:border-purple-700" : "",
    "transition-colors",
    "mx-2 px-2 md:pb-4 md:pt-2",
    "max-md:py-2 max-md:my-2",
    "border-4 rounded-2xl"
  ),
  cardContainer: tw(
    "flex md:flex-col",
    "items-center justify-center",
    "md:space-y-1.5",
    "max-md:space-x-2"
  ),
  label: tw(
    "text-xl font-bold",
    "select-none",
    "max-md:w-full text-center"
  )
}

type HandProps = {
  onHover?: (card?: number) => void,
  onExit?: () => void
}

export default function Hand({ onHover, onExit }: HandProps) {
  const [room,] = useRoom();

  const color = room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple";

  return (<>
    <div className={styles.container(color)}>
      <p className={styles.label}>Hand</p>
      <div className={styles.cardContainer}>
        {room.myHand?.map((card, i) => (
          <Card
            onHover={() => onHover?.(i)}
            onExit={onExit}
            key={`hand-${i}`}
            cardType={card}
            chip={{ color: "empty" }} />
        ))}
      </div>
    </div>
  </>);
}