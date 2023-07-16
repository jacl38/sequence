import tw from "../util/tw";
import LogoTitle from "./LogoTitle";
import RoomIDIndicator from "./RoomIDIndicator";
import PublicPrivateSwitch from "./PublicPrivateSwitch";
import { useRoom } from "../store/store";
import RoomIDEntry from "./RoomIDEntry";
import DarkSwitcher from "./DarkSwitcher";
import CreateRoomButton from "./CreateRoomButton";

const styles = {
  outerContainer: tw(
    "bg-indigo-800 dark:bg-indigo-950 transition-[background-color]",
    "text-white",
    "overflow-hidden",
    "flex flex-row justify-between items-center",
  ),
  left: {
    container: tw(
      "p-4 space-x-8",
      "mx-4",
      "flex-auto",
      "flex flex-row items-center"
    )
  }
}

export default function Header() {
  const [room, setRoom] = useRoom();

  return ( <>
    <header className={styles.outerContainer}>
      <div className={styles.left.container}>
        <LogoTitle />

        {room.id
          ? <>
            <RoomIDIndicator />
            <PublicPrivateSwitch />
          </>
          : <>
            <RoomIDEntry />
            <CreateRoomButton />
          </>
        }

      </div>
      <div className="p-4">
        <DarkSwitcher />
      </div>
    </header>
  </> );
}