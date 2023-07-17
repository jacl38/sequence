import { useEffect } from "react";
import socket from "../socket";
import { useRoom } from "../store/store";
import tw from "../util/tw";
import { Room } from "../store/types";

const styles = {
  publicIndicator: tw(
    "absolute",
    "whitespace-nowrap",
    "text-sm",
    "hover:scale-110",
    "font-semibold",
    "cursor-pointer select-none",
    "transition-[transform]"
  ),
}

export default function PublicPrivateSwitch() {
  const [room, setRoom] = useRoom();

  function setPublic(isPublic: boolean) {
    setRoom({ public: isPublic });
    socket.emit("set-public", isPublic);
  }
  
  useEffect(() => {
    socket.on("room-config-changed", (newRoom: Room) => {
      setRoom(newRoom);
    });
  }, [room]);

  return (
    <div className="relative flex items-center">
      <input
        hidden
        type="checkbox"
        checked={room.public}
        onChange={e => setPublic(e.target.checked)}
        id="public"
      />
      <label
        htmlFor="public"
        className={styles.publicIndicator}>
        {room.public
          ? <>&#128275;&#xFE0E; Public</>
          : <>&#128274;&#xFE0E; Private</>
        }
      </label>
    </div>
  );
}