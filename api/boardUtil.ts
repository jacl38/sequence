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

export function cardCanBePlayed({ card, board, myColor }: { card: BoardSpace, board: Board, myColor: "green" | "purple" }) {
  // always keep one-eyed jacks
  if(card.suit === "clubs" || card.suit === "spades") return true;

  for(let row = 0; row < board.length; row++) {
    for(let col = 0; col < board[row].length; col++) {
      if(validateAction({
        position: { row, col },
        board,
        myColor,
        hand: [card]
      }) !== undefined) return true;
    }
  }
  return false;
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
    if(!space.chip.permanent) {
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

export function findWinCondition(board: Board): "green" | "purple" | "empty" {
  for(let row = 0; row < board.length; row++) {
    for(let col = 0; col < board[row].length; col++) {
      // pivot point: [row, col]
      
      // pivot point is in range for a vertical sequence
      if(row < board.length - 4) {
        // slice the board to get the 5 chips in a row and their positions
        const verticalColors = board.slice(row, row + 5).map((r, r0) => ({
          color: r[col].chip.color,
          position: { row: row + r0, col }
        }));
        // check if the 5 chips are all the same color (or wild corner)
        if(verticalColors.every(color => color.color === "green" || isCorner(color.position.row, color.position.col))) return "green";
        if(verticalColors.every(color => color.color === "purple" || isCorner(color.position.row, color.position.col))) return "purple";
      }

      // pivot point is in range for a horizontal sequence
      if(col < board[row].length - 4) {
        // slice the board to get the 5 chips in a row and their positions
        const horizontalColors = board[row].slice(col, col + 5).map((c, c0) => ({
          color: c.chip.color,
          position: { row, col: col + c0 }
        }));
        // check if the 5 chips are all the same color (or wild corner)
        if(horizontalColors.every(color => color.color === "green" || isCorner(color.position.row, color.position.col))) return "green";
        if(horizontalColors.every(color => color.color === "purple" || isCorner(color.position.row, color.position.col))) return "purple";
      }

      // pivot point is in range for a diagonal sequence (top left to bottom right)
      if(row < board.length - 4 && col < board[row].length - 4) {
        // slice the board to get the 5 chips in a row and their positions
        const diagonalColors = board.slice(row, row + 5).map((r, r0) => ({
          color: r[col].chip.color,
          position: { row: row + r0, col: col + r0 }
        }));
        // check if the 5 chips are all the same color (or wild corner)
        if(diagonalColors.every(color => color.color === "green" || isCorner(color.position.row, color.position.col))) return "green";
        if(diagonalColors.every(color => color.color === "purple" || isCorner(color.position.row, color.position.col))) return "purple";
      }

      // pivot point is in range for a diagonal sequence (bottom left to top right)        
      if(row > 4 && col < board[row].length - 4) {
        // slice the board to get the 5 chips in a row and their positions
        const diagonalColors = board.slice(row - 4, row + 1).map((r, r0) => ({
          color: r[col].chip.color,
          position: { row: row - r0, col: col + r0 }
        }));
        // check if the 5 chips are all the same color (or wild corner)
        if(diagonalColors.every(color => color.color === "green" || isCorner(color.position.row, color.position.col))) return "green";
        if(diagonalColors.every(color => color.color === "purple" || isCorner(color.position.row, color.position.col))) return "purple";
      }
    }
  }
  return "empty";
}