import { useRoom } from "../store/store"
import tw from "../util/tw"

const styles = {
  roomID: tw(
    "before:content-['Room_ID:']",
    "before:font-sans",
    "relative",
    "font-mono",
    "bg-white bg-opacity-10 focus:bg-blue-200 focus:bg-opacity-40",
    "py-2 px-3 rounded-xl",
    "hover:scale-105",
    "transition-[transform,background-color]"
  )
}

export default function RoomIDIndicator() {
  const [room,] = useRoom();

  return (
    <button
      title="Copy to Clipboard"
      onClick={() => navigator.clipboard.writeText(room.id || "")}
      className={styles.roomID}>
        <span className="mx-2">{room.id || "XXXX-XXXX-XXXX"}</span>
        <span className="-rotate-45 -translate-y-4 absolute">&#9986;&#xFE0E;</span>
    </button>
  )
}