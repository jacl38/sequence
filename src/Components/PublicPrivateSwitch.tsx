import { useRoom } from "../store/store";
import tw from "../util/tw";

const styles = {
  publicIndicator: tw(
    "absolute",
    "whitespace-nowrap",
    "text-sm",
    "hover:scale-110",
    "font-semibold",
    "cursor-pointer",
    "transition-[transform]"
  ),
}

export default function PublicPrivateSwitch() {
  const [room, setRoom] = useRoom();

  return (
    <div className="relative flex items-center">
      <input
        hidden
        type="checkbox"
        defaultChecked={room.public}
        onChange={e => setRoom({ ...room, public: e.target.checked })}
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