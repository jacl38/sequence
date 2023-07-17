export type BoardSpace = {
  suit: "clubs" | "diamonds" | "hearts" | "spades" | "wild",
  value: "wild" | "ace" | "two" | "three" | "four" | "five" | "six" | "seven" | "eight" | "nine" | "ten" | "jack" | "queen" | "king";
}

type Chip = {
  color: "blue" | "green" | "empty",
  permanent?: boolean
}

export type Board = {
  space: BoardSpace,
  chip: Chip
}[][];

export type GameState =
  | "lobby"
  | "turn-blue"
  | "turn-green"
  | "end-blue"
  | "end-green"
  | "end-tie"

export type Room = {
  id: string,
  users: string[],
  public: boolean,
  gameState: GameState,
  board: Board
}