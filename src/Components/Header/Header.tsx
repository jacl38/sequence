import { tw } from "../../util/styled";
import LogoTitle from "./LogoTitle";
import RoomIDIndicator from "./RoomIDIndicator";
import PublicPrivateSwitch from "./PublicPrivateSwitch";
import { useRoom } from "../../store/store";
import RoomIDEntry from "./RoomIDEntry";
import DarkSwitcher from "./DarkSwitcher";
import CreateRoomButton from "./CreateRoomButton";
import BeginButton from "./BeginButton";
import RematchButton from "./RematchButton";

const styles = {
  outerContainer: tw(
    "bg-blue-800 dark:bg-blue-950 transition-[background-color]",
    "text-white",
    "overflow-hidden",
    "flex-shrink-0",
    "flex flex-row justify-between items-center",
    "z-20"
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
  const [room,] = useRoom();

  return ( <>
    <header className={styles.outerContainer}>
      <div className={styles.left.container}>
        <LogoTitle />

        {room.id
          ? <>
            <RoomIDIndicator />
            {room.gameState === "lobby" && <BeginButton />}
            {room.users.length < 2 && <PublicPrivateSwitch />}
          </>
          : <>
            <RoomIDEntry />
            <CreateRoomButton />
          </>
        }

        {room.gameState.split("-")[0] === "end" && <>
          <RematchButton />
        </>}

      </div>
      <div className="p-4">
        <DarkSwitcher />
      </div>
    </header>
  </> );
}