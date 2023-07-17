export const CardSuits = ["clubs", "diamonds", "hearts", "spades", "wild"] as const;
export const CardValues = ["wild", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"] as const;

export type BoardSpace = {
  suit: typeof CardSuits[number],
  value: typeof CardValues[number];
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

export const GameState = [
  "lobby",
  "turn-purple",
  "turn-green",
  "end-purple",
  "end-green",
  "end-tie"
] as const;

export type Room = {
  id: string,
  users: string[],
  myHand: Hand,
  public: boolean,
  gameState: typeof GameState[number],
  board: Board
}