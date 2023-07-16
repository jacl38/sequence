import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { Room } from "./types";
import { useSelector } from "react-redux";

const initialRoomState: Room = {
  id: "",
  users: [],
  public: false
}

export const roomSlice = createSlice({
  name: "room",
  initialState: initialRoomState,
  reducers: {
    setPublic: (state, action: PayloadAction<boolean>) => {
      state.public = action.payload;
    },
  }
});

export const { setPublic } = roomSlice.actions;

export const roomStore = configureStore({
  reducer: {
    room: roomSlice.reducer
  }
});

export type RoomRootState = ReturnType<typeof roomStore.getState>;
export type RoomDispatch = typeof roomStore.dispatch;

export const useRoomState = () => useSelector((state: RoomRootState) => state.room);
export const setRoomState = (state: Room) => {
  roomStore.dispatch(setPublic(state.public));
  //...
}

export const useRoom = () => [useRoomState(), setRoomState] as const;