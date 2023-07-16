import { useState } from "react";
import { useDarkMode } from "../Hooks/useDarkMode";
import tw from "../util/tw";
import { filterRoomIDInput, isValidRoomID, validRoomIDCharacters } from "../util/room";

type HeaderProps = {
  roomID?: string,
  roomIsPublic?: boolean,
  onJoinRoom: (roomID: string) => void,
  setPublic: (isPublic: boolean, roomID: string) => void
}

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
    ),
    title: {
      text: tw(
        "text-2xl",
        "font-black tracking-wide",
        "select-none",
        "relative group",
      ),
      decor: {
        container: tw(
          "group-hover:rotate-180",
          "transition-transform duration-500",
          "origin-center",
          "absolute",
          "pointer-events-none",
          "w-full h-full flex justify-between"
        ),
        item: tw(
          "relative",
          "group-hover:-rotate-180",
          "flex items-center justify-center",
          "transition-transform duration-700"
        ),
        blackItem: tw(
          "absolute",
          "opacity-100 group-hover:opacity-0",
          "scale-100 group-hover:scale-0",
          "transition-[opacity,transform] duration-500"
        ),
        redItem: tw(
          "absolute",
          "text-rose-700",
          "scale-0 group-hover:scale-100",
          "opacity-0 group-hover:opacity-100",
          "transition-[opacity,transform] duration-500",
        )
      }
    },
    roomID: tw(
      "before:content-['Room_ID:']",
      "before:font-sans",
      "relative",
      "font-mono",
      "bg-white bg-opacity-10 focus:bg-blue-200 focus:bg-opacity-40",
      "py-2 px-3 rounded-xl",
      "hover:scale-105",
      "transition-[transform,background-color]"
    ),
    publicIndicator: tw(
      "absolute",
      "whitespace-nowrap",
      "text-sm",
      "hover:scale-110",
      "font-semibold",
      "cursor-pointer",
      "transition-[transform]"
    ),
    roomIDInput: tw(
      "[&>input]:py-2 [&>input]:px-3",
      "overflow-hidden",
      "font-mono",
      "bg-white dark:bg-black bg-opacity-10 dark:bg-opacity-10",
      "border-4 border-opacity-20 border-white dark:border-black",
      "rounded-xl",
      "flex",
      "hover:scale-105",
      "transition-all"
    )
  },
  right: {
    container: tw(
      "p-4"
    ),
    darkButton: {
      container: tw(
        "relative group",
        "w-12 h-12 hover:w-40",
        "flex items-center justify-center",
        "font-black",
        "rounded-full",
        "bg-white dark:bg-black",
        "bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-20",
        "border-4 border-opacity-20 border-white dark:border-black",
        "overflow-hidden",
        "transition-all"
      ),
      label: tw(
        "absolute",
        "right-12",
        "whitespace-nowrap",
        "group-hover:opacity-100 opacity-0 transition-opacity"
      ),
      moon: tw(
        "absolute right-3",
        "dark:rotate-90 dark:scale-0",
        "transition-all"
      ),
      sun: tw(
        "absolute right-3",
        "rotate-90 dark:rotate-0",
        "scale-0 dark:scale-100",
        "text-stone-200",
        "transition-all"
      )
    }
  }
}

export default function Header({ roomID, roomIsPublic, onJoinRoom, setPublic }: HeaderProps) {

  const [dark, setDark] = useDarkMode(false);

  const [enteredRoomID, setEnteredRoomID] = useState("");

  return ( <>
    <header className={styles.outerContainer}>
      <div className={styles.left.container}>
        <a href="/">
          <h1 className={styles.left.title.text}>
            <div className={styles.left.title.decor.container}>
              <span className={styles.left.title.decor.item}>
                <span className={styles.left.title.decor.blackItem}>&#9827;&#xFE0E;</span>
                <span className={styles.left.title.decor.redItem}>&#9830;&#xFE0E;</span>
              </span>
              <span className={styles.left.title.decor.item}>
                <span className={styles.left.title.decor.blackItem}>&#9824;&#xFE0E;</span>
                <span className={styles.left.title.decor.redItem}>&#9829;&#xFE0E;</span>
              </span>
            </div>
            <span className="ml-4 mx-4">Sequence</span>
          </h1>
        </a>

        {roomID && <>
          <button
            title="Copy to Clipboard"
            onClick={() => navigator.clipboard.writeText(roomID || "")}
            className={styles.left.roomID}>
              <span className="mx-2">{roomID || "XXXX-XXXX-XXXX"}</span>
              <span className="-rotate-45 -translate-y-4 absolute">&#9986;&#xFE0E;</span>
          </button>

          <div className="relative flex items-center">
            <input
              hidden
              type="checkbox"
              defaultChecked={roomIsPublic}
              onChange={e => setPublic(e.target.checked, roomID || "")}
              id="public"
            />
            <label
              htmlFor="public"
              className={styles.left.publicIndicator}>
              {roomIsPublic ? <>&#128275;&#xFE0E; Public</> : <>&#128274;&#xFE0E; Private</>}
            </label>
          </div>
        </>}

        {!roomID && <>
          <div className={styles.left.roomIDInput}>
            <input
              type="text"
              placeholder="Enter Room ID"
              maxLength={14}
              className="bg-transparent w-full h-full outline-none"
              onPaste={e => {
                e.currentTarget.value = filterRoomIDInput(e.clipboardData.getData("text/plain"));
                setEnteredRoomID(e.currentTarget.value);
              }}
              onKeyUp={e => {
                e.currentTarget.value = filterRoomIDInput(e.currentTarget.value);
                setEnteredRoomID(e.currentTarget.value);
              }}
              onKeyDown={e => {
                if(e.key !== "Backspace" && !e.getModifierState("Control") && e.key !== "Tab") {
                  e.preventDefault();
                  const char = e.key.toUpperCase();
                  if (validRoomIDCharacters.includes(char) && e.currentTarget.value.length < 14) {
                    e.currentTarget.value += char;
                    if(e.currentTarget.value.length === 4 || e.currentTarget.value.length === 9) e.currentTarget.value += "-";
                  }
                } else {
                  e.currentTarget.value = filterRoomIDInput(e.currentTarget.value);
                }
                setEnteredRoomID(e.currentTarget.value);
                if(e.key === "Enter" && isValidRoomID(e.currentTarget.value)) {
                  onJoinRoom(e.currentTarget.value);
                }
              }} />
              <button
                disabled={!isValidRoomID(enteredRoomID)}
                onClick={() => {
                  setEnteredRoomID("");
                  onJoinRoom(enteredRoomID);
                }}
                className={tw(
                  "w-12",
                  "bg-white bg-opacity-5",
                  "font-black text-3xl",
                  "flex justify-center",
                  "transition-opacity",
                  isValidRoomID(enteredRoomID) ? "" : "opacity-50")}>
                  &rsaquo;
              </button>
          </div>
        </>}

      </div>
      <div className={styles.right.container}>
        <button className={styles.right.darkButton.container} onClick={() => setDark(!dark)}>
          <span className={styles.right.darkButton.label}>{dark ? "Light" : "Dark"} Mode</span>
          <span className={styles.right.darkButton.sun}>&#9728;&#xFE0E;</span>
          <span className={styles.right.darkButton.moon}>&#127769;&#xFE0E;</span>
        </button>
      </div>
    </header>
  </> );
}