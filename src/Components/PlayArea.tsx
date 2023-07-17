import { useState } from "react"
import socket from "../socket"
import { useRoom } from "../store/store"
import { GameState } from "../store/types"
import { tw } from "../util/styled"
import Board from "./Board/Board"
import Hand from "./Board/Hand"

const styles = {
  gameContainer: tw(
    "flex justify-stretch",
    "max-md:flex-col",
    "w-full"
  ),
  leftDiv: tw(
    "flex-auto",
    "flex justify-center md:justify-end items-center",
    "max-md:order-3"
  ),
  rightDiv: tw(
    "flex-auto",
    "flex justify-center md:justify-start items-center"
  ),
  turnIndicator: tw(
    "text-center",
    "text-lg"
  )
}

function getTurnIndicator(gameState: typeof GameState[number], myColor: "green" | "purple") {
  const turnColor = gameState.split("-")[1] as "green" | "purple";
  if(!["green", "purple"].includes(gameState.split("-")[1])) return;

  if(turnColor === myColor) return "Your turn";
  else return "Opponent's turn";
}

export default function PlayArea() {
  const [room,] = useRoom();

  const [hoveredHandCard, setHoveredHandCard] = useState<number | undefined>(undefined);

  return <div className={styles.gameContainer}>
    <div className={styles.leftDiv}>help</div>

    <div className="flex flex-col items-center pt-3 space-y-2 shrink-0">
      <p className={styles.turnIndicator}>
        {getTurnIndicator(room.gameState, room.users.findIndex(u => u === socket.id) === 0 ? "green" : "purple")}
      </p>
      <Board hoveredHandCard={hoveredHandCard} />
    </div>

    <div className={styles.rightDiv}>
      <Hand onHover={setHoveredHandCard} onExit={() => setHoveredHandCard(undefined)} />
    </div>
  </div>
}