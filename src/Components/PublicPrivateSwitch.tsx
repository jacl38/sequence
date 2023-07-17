import socket from "../socket";
import { useRoom } from "../store/store";
import { tw } from "../util/styled";

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
  const [room,] = useRoom();

  function setPublic(isPublic: boolean) {
    socket.emit("set-public", isPublic);
  }

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