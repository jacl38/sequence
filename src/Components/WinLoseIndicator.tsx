import { useState } from "react";
import Styled, { tw } from "../util/styled";

type WinLoseIndicatorProps = {
  winState: "win" | "lose" | "tie",
  onRestart: () => void,
  onClose: () => void
}

const styles = {
  container: tw(
    "absolute z-20",
    "w-full h-48",
    "flex items-center justify-center",
    "animate-fadeIn"
  ),
  card: tw(
    "p-4",
    "absolute",
    "bg-white dark:bg-stone-700",
    "border-4 border-stone-300 dark:border-stone-950",
    "shadow-lg shadow-black/25",
    "rounded-xl",
    "space-y-4",
    "transition-colors"
  ),
  label: tw(
    "text-2xl font-bold text-center",
  ),
  shade: tw(
    "scale-105 z-10",
    "fixed inset-0",
    "bg-black/25",
    "backdrop-blur-sm"
  )
}

function getWinMessage(winState: "win" | "lose" | "tie") {
  switch (winState) {
    case "win":
      return "You won! 🥳";
    case "lose":
      return "You lost. 😞";
    case "tie":
      return "It's a tie. 😐";
  }
}

export default function WinLoseIndicator({ winState, onRestart, onClose }: WinLoseIndicatorProps) {
  return ( <>
    <div className={styles.shade}></div>
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.label}>{getWinMessage(winState)}</p>
        <div className="flex justify-evenly w-72 space-x-4">
          <Styled.Button
            onClick={onClose}
            className="w-1/2 bg-stone-300/50">
            Close
          </Styled.Button>
          <Styled.Button
            onClick={onRestart}
            className="w-1/2 bg-blue-700/60 dark:bg-blue-700/50 text-white font-bold">
            Rematch
          </Styled.Button>
        </div>
      </div>
    </div>
  </>);
}