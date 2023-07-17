import { Board, BoardSpace, Hand } from "./types";
import boardMap from "./board.json";

export function makeBoard(): Board {
  const board: Board = [];
  for(let i = 0; i < 10; i++) {
    const row: {
      space: BoardSpace,
      chip: { color: "purple" | "green" | "empty" }
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

// returns the index in the hand of the card that is being played, or undefined if the action is invalid
export function validateAction({ position, hand, board, myColor }: { position: { row: number, col: number }, hand: Hand, board: Board, myColor: "green" | "purple" }): undefined | number {
  const space = board[position.row][position.col];
  const oppositeColor = myColor === "green" ? "purple" : "green";

  // Can't place on a space that already has your chip
  if(space.chip.color === myColor) return undefined;

  // If the opponent has a chip there, the action is only legit if the player has a one-eyed jack
  // and if the space is not marked as permanent (i.e. part of a sequence already)
  if(space.chip.color === oppositeColor) {
    if(space.chip.permanent === false) {
      const jackIndex = hand.findIndex(card => (card.suit === "spades" || card.suit === "clubs") && card.value === "jack");
      if(jackIndex !== -1) return jackIndex;
    }
    return undefined;
  }
  
  // space must be empty
  // check if the hand contains the card in this space
  const cardIndex = hand.findIndex(card => card.suit === space.space.suit && card.value === space.space.value);
  if(cardIndex !== -1) return cardIndex;

  // check if the hand contains a two-eyed jack
  const jackIndex = hand.findIndex(card => (card.suit === "diamonds" || card.suit === "hearts") && card.value === "jack");
  if(jackIndex !== -1) return jackIndex;

  // check if the space is a wild space. Not a valid placement.
  if(space.space.suit === "wild") return undefined;

  // not a valid action (no matching card, or two-eyed jacks in hand, or incorrect placement)
  return undefined
}

function isCorner(row: number, col: number): boolean {
  return (row === 0 && col === 0) || (row === 0 && col === 9) || (row === 9 && col === 0) || (row === 9 && col === 9);
}

function hasWinCondition(board: Board): "green" | "purple" | "empty" {
  for(let row = 0; row <= board.length - 4; row++) {
    for(let col = 0; col <= board[row].length - 4; col++) {
      const color = board[row][col].chip.color;

      let horizontalSequence = true;
      let verticalSequence = true;
      let diagonalSequence = true;
      for(let i = 0; i < 5; i++) {
        // check horizontal
        const hx = row + i;
        const hy = col;
        const hChip = board[hx][hy].chip.color;
        
        // check vertical
        const vx = row;
        const vy = col + i;
        const vChip = board[vx][vy].chip.color;

        // check diagonal
        const dx = row + i;
        const dy = col + i;
        const dChip = board[dx][dy].chip.color;

        // check if any of the sequences are broken

        // if the chip is not the same color, and it's not a corner (wild), then the sequence is broken
        if(hChip !== color && !isCorner(hx, hy)) horizontalSequence = false;
        if(vChip !== color && !isCorner(vx, vy)) verticalSequence = false;
        if(dChip !== color && !isCorner(dx, dy)) diagonalSequence = false;
      }
      if(horizontalSequence || verticalSequence || diagonalSequence) return color;
    }
  }
  return "empty";
}