const suit = ["clubs", "diamonds", "hearts", "spades", "wild"] as const;
const value = ["wild", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"] as const;

export type BoardSpace = {
  suit: typeof suit[number],
  value: typeof value[number];
}

export type Chip = {
  color: "purple" | "green" | "empty",
  permanent?: boolean
}

export type Hand = BoardSpace[];

export type Board = {
  space: BoardSpace,
  chip: Chip
}[][];

export type GameState =
  | "lobby"
  | "turn-purple"
  | "turn-green"
  | "end-purple"
  | "end-green"
  | "end-tie"

export type Room = {
  id: string,
  users: string[],
  myHand: Hand,
  public: boolean,
  gameState: GameState,
  board: Board
}