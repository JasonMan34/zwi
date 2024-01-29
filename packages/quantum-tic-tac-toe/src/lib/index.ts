export type Letter = 'X' | 'O';
export type Player = { letter: Letter; name: string; color: string };
export type Players = Record<Letter, Player>;

export type Tile = Letter | null;
export type Board<T = Tile> = [T, T, T, T, T, T, T, T, T];
export type SimpleBoard = Board;

export const getNewBoard = (): SimpleBoard => [null, null, null, null, null, null, null, null, null];

const winPatterns = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const getWinner = (board: Board): Letter | null => {
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
};
