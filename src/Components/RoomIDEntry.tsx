import { useState } from "react";
import { filterRoomIDInput, validRoomIDCharacters, isValidRoomID } from "../util/room";
import socket from "../socket";
import { tw } from "../util/styled";

const styles = {
  roomIDInput: tw(
    "[&>input]:py-2 [&>input]:px-3",
    "overflow-hidden",
    "font-mono",
    "bg-white bg-opacity-10",
    "dark:bg-gray-500 dark:bg-opacity-10",
    "border-white border-opacity-20",
    "dark:border-gray-500 dark:border-opacity-20",
    "border-4",
    "dark:border-opacity-20",
    "rounded-xl",
    "flex",
    "hover:scale-105",
    "transition-all"
  ),
  confirmButton: (valid: boolean) => tw(
    "w-12",
    "bg-white bg-opacity-5",
    "font-black text-3xl",
    "flex justify-center",
    "transition-[opacity,background-color]",
    valid ? "hover:bg-opacity-10" : "opacity-50")
}

export default function RoomIDEntry() {

  const [enteredRoomID, setEnteredRoomID] = useState("");

  function joinRoom() {
    if(!isValidRoomID(enteredRoomID)) return;
    socket.emit("join-room", enteredRoomID, (status: "success" | "full" | "not-found") => {
      if(status === "success") return;
      if(status === "full") alert("Couldn't join room: Room is full.")
      if(status === "not-found") alert("Couldn't join room: Room not found. Check the Room ID and try again.");
    });
  }

  function keyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // if a valid character is pressed, add it to the input
    if(validRoomIDCharacters.includes(e.key)) {
      e.preventDefault();
      if (e.currentTarget.value.length < 14) e.currentTarget.value += e.key.toUpperCase();
    // otherwise...
    } else {
      let result = e.currentTarget.value;
      if(e.key === "Backspace") {

        const sections = result.split("-").filter(s => s.length > 0);
        const lastChar = e.currentTarget.value[e.currentTarget.value.length - 1];

        // if we're holding control, remove the entire last section
        if(e.getModifierState("Control")) {
          // cancel the default keyboard backspace behavior
          e.preventDefault();
          sections.pop();
          // otherwise, just 
        } else if(lastChar === "-") {
          // cancel the default keyboard backspace behavior
          e.preventDefault();
          // remove the last character of the last section
          sections[sections.length - 1] = sections[sections.length - 1].slice(0, -1);
        }
        result = sections.join("-");
      }
      e.currentTarget.value = filterRoomIDInput(result);
    }
    setEnteredRoomID(e.currentTarget.value);
    if(e.key === "Enter" && isValidRoomID(e.currentTarget.value)) joinRoom();
  }

  return (
    <div className={styles.roomIDInput}>
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
        onKeyDown={keyDown} />
      <button
        disabled={!isValidRoomID(enteredRoomID)}
        onClick={() => {
          joinRoom();
        }}
        className={styles.confirmButton(isValidRoomID(enteredRoomID))}>
          &rsaquo;
      </button>
  </div>
  )
}