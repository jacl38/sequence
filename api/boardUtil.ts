import { Board, BoardSpace } from "./types";
import boardMap from "./board.json";

export function makeBoard(): Board {
  const board: Board = [];
  for(let i = 0; i < 10; i++) {
    const row: {
      space: BoardSpace,
      chip: { color: "blue" | "green" | "empty" }
    }[] = [];
    for(let j = 0; j < 10; j++) {
      row.push({
        space: boardMap[i][j] as BoardSpace,
        chip: { color: "empty" }
      });
    }
    board.push(row);
  }
  return board;
}