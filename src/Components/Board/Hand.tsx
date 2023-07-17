import { useEffect, useState } from "react";
import { useRoom } from "../../store/store";
import socket from "../../socket";
import { Hand } from "../../store/types";
import { tw } from "../../util/styled";
import Card from "./Card";

const styles = {
  container: (color: "green" | "purple") => tw(
    "flex flex-col",
    "items-center justify-center",
    "space-y-1.5 px-2 mx-2 pb-4 pt-2",
    color === "green" ? "bg-green-400 border-green-500" : "",
    color === "purple" ? "bg-purple-400 border-purple-500" : "",
    "border-4 rounded-2xl"
  ),
  label: tw(
    "text-xl font-bold",
    "select-none"
  )
}

export default function Hand() {
  const [room,] = useRoom();
  const [hand, setHand] = useState<Hand>([]);

  const color = room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple";

  useEffect(() => {
    setHand(room.myHand);
  }, []);

  return (<>
    <div className={styles.container(color)}>
      <p className={styles.label}>Hand</p>
      {hand?.map((card, i) => <Card key={`hand-${i}`} cardType={card} chip={{ color: "empty" }} />)}
    </div>
  </>);
}