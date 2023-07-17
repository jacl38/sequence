import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { Room } from "./types";
import { useSelector } from "react-redux";

const initialRoomState: Room = {
  id: "",
  users: [],
  public: false,
  gameState: "lobby",
  board: [],
  myHand: []
}

export const roomSlice = createSlice({
  name: "room",
  initialState: initialRoomState,
  reducers: {
    setPublic: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        public: action.payload
      }
    },
    setUsers: (state, action: PayloadAction<string[]>) => {
      return {
        ...state,
        users: action.payload
      }
    },
    setId: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        id: action.payload
      }
    },
    setRoom: (state, action: PayloadAction<Partial<Room>>) => {
      return { ...state, ...action.payload }
    }
  }
});

export const { setPublic, setUsers, setId, setRoom } = roomSlice.actions;

export const roomStore = configureStore({
  reducer: {
    room: roomSlice.reducer
  }
});

export type RoomRootState = ReturnType<typeof roomStore.getState>;
export type RoomDispatch = typeof roomStore.dispatch;

export const useRoomState = () => useSelector((state: RoomRootState) => state.room);
export const setRoomState = (state: Partial<Room>) => roomStore.dispatch(roomSlice.actions.setRoom(state));
export const useRoom = () => [useRoomState(), setRoomState] as const;