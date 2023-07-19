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
    "flex justify-between items-center max-md:flex-col",
    "z-20"
  ),
  left: {
    container: tw(
      "md:px-4 max-md:pt-4 max-md:pb-4 max-md:w-4/5",
      "md:space-x-6 max-md:space-y-3",
      "mx-4",
      "flex-auto",
      "flex max-md:flex-col items-center max-md:items-stretch"
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
            <div className="md:absolute flex max-md:flex-col md:left-1/2 md:-translate-x-1/2 md:space-x-4 max-md:space-y-2">
              <RoomIDEntry />
              <CreateRoomButton />
            </div>
          </>
        }

        {room.gameState.split("-")[0] === "end" && <>
          <RematchButton />
        </>}

      </div>
      <div className="md:p-4 pb-4">
        <DarkSwitcher />
      </div>
    </header>
  </> );
}