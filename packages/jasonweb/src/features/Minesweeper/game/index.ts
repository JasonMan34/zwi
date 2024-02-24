import shuffleArray from 'shuffle-array';

const clamp = (value: number, min: number, max: number) => {
  const realMin = Math.min(min, max);
  const realMax = Math.max(min, max);

  return Math.min(Math.max(value, realMin), realMax);
};

export type Callback = () => void | Promise<void>;

export interface MinesweeperGame {
  isSandbox: boolean;
  revealedCount: number;
  minesLeft: number;
  board: MinesweeperTile[][];
  allTiles: MinesweeperTile[];
  mines: MinesweeperTile[];
  initiated: boolean;
  isGameLost: boolean;
  isGameWon: boolean;
  onGameInitEventListeners: Callback[];
  onGameLostEventListeners: Callback[];
  onGameWonEventListeners: Callback[];
}

export interface MinesweeperTile {
  row: number;
  col: number;
  board: MinesweeperTile[][];
  value: number;
  isMine: boolean;
  isPeaking: boolean;
  isLosingTile: boolean;
  status: TileStatus;
  /** How many flags are there adjacent to this tile */
  flagCount: number;
  /**
   * A tile that is revealed and all of its adjacent tiles are also revealed is in a final state.
   * Meaning it does not affect the game anymore
   */
  isFinal: boolean;
}

export type TileStatus = 'hidden' | 'flagged' | 'revealed';

export const createMinesweeperGame = (
  width: number,
  height: number,
  mineCount: number,
  isSandbox = false,
): MinesweeperGame => {
  if (
    !Number.isInteger(width) ||
    width <= 0 ||
    !Number.isInteger(height) ||
    height <= 0 ||
    !Number.isInteger(mineCount) ||
    mineCount <= 0
  ) {
    throw new Error('Invalid parameters');
  }

  const game: MinesweeperGame = {
    isSandbox,
    revealedCount: 0,
    minesLeft: mineCount,
    board: [],
    allTiles: [],
    mines: [],
    initiated: false,
    isGameLost: false,
    isGameWon: false,
    onGameInitEventListeners: [],
    onGameLostEventListeners: [],
    onGameWonEventListeners: [],
  };

  for (let row = 0; row < height; row++) {
    game.board[row] = [];
    for (let col = 0; col < width; col++) {
      game.board[row][col] = createMinesweeperTile(game.board, row, col);
    }
  }

  game.allTiles = game.board.flat();

  return game;
};

export const initBoard = (game: MinesweeperGame, row: number, col: number) => {
  const firstTile = game.board[row][col];
  const potentialMines = game.allTiles.filter((tile) => tile !== firstTile);
  shuffleArray(potentialMines);
  const minePoints = potentialMines.slice(0, game.minesLeft);
  minePoints.forEach((tile) => (tile.isMine = true));
  minePoints.forEach((tile) => calculateValue(tile));

  game.mines = minePoints;
  game.initiated = true;

  game.onGameInitEventListeners.forEach((cb) => cb());
};

export const gameOver = (game: MinesweeperGame) => {
  game.isGameLost = true;
  game.mines.forEach((mine) => {
    if (mine.status === 'flagged') {
      reveal(game, mine);
    }
  });

  game.onGameLostEventListeners.forEach((cb) => cb());
};

export const click = (game: MinesweeperGame, row: number, col: number) => {
  const tile = game.board[row][col];
  if (tile.status !== 'hidden') return;

  if (!tile.isMine) {
    reveal(game, tile);
  } else {
    tile.isLosingTile = true;
    tile.status = 'revealed';
    gameOver(game);
  }
};

export const flag = (game: MinesweeperGame, row: number, col: number, flagOnly = false) => {
  const tile = game.board[row][col];

  if (game.isSandbox) {
    tile.status = tile.status === 'flagged' ? 'hidden' : 'flagged';
    tile.isMine = !tile.isMine;
    forAdjacent(tile, (t) => calculateValue(t));
    return;
  }

  if (game.isGameLost) return;

  // For game over, just flag it, nothing else
  if (flagOnly) {
    tile.status = 'flagged';
    return;
  }

  if (tile.status === 'flagged') {
    tile.status = 'hidden';
    forAdjacent(tile, (t) => t.flagCount--);
    game.minesLeft++;
  } else {
    tile.status = 'flagged';
    updateIsFinal(tile);
    forAdjacent(tile, (t) => {
      t.flagCount++;
      updateIsFinal(t);
    });
    game.minesLeft--;
  }
};

const updateIsFinal = (tile: MinesweeperTile) => {
  tile.isFinal = tile.status !== 'hidden' && getAdjacent(tile, 'hidden').length === 0;
};

export const peak = (tile: MinesweeperTile) => {
  if (tile.isFinal || tile.status === 'flagged') return;

  tile.isPeaking = true;

  // If we are revealed, peaking means to also peak the unrevealed adjacent
  if (tile.status === 'revealed') {
    const unrevealedAdjacent = getAdjacent(tile, 'hidden');
    unrevealedAdjacent.forEach((t) => peak(t));
  }
};

export const unpeak = (tile: MinesweeperTile) => {
  if (tile.isFinal || tile.status === 'flagged') return;

  tile.isPeaking = false;

  if (tile.status === 'revealed') {
    // If we are revealed, unpeaking means to unpeak the unrevealed adjacent
    const unrevealedAdjacent = getAdjacent(tile, 'hidden');
    unrevealedAdjacent.forEach((t) => unpeak(t));
  }
};

export const reveal = (game: MinesweeperGame, tile: MinesweeperTile) => {
  tile.status = 'revealed';
  updateIsFinal(tile);
  forAdjacent(tile, (t) => updateIsFinal(t));

  if (game.isGameLost) return;

  if (tile.isMine) {
    tile.isLosingTile = true;
    gameOver(game);
  } else {
    upRevealCount(game);
  }
};

const upRevealCount = (game: MinesweeperGame) => {
  game.revealedCount++;
  if (game.revealedCount === game.allTiles.length - game.mines.length) {
    game.isGameWon = true;
    game.minesLeft = 0;
    getAllTiles(game, 'hidden').forEach((tile) => flag(game, tile.row, tile.col, true));
    game.onGameWonEventListeners.forEach((cb) => cb());
  }
};

const getAllTiles = (game: MinesweeperGame, ...statuses: TileStatus[]) => {
  if (statuses.length === 0) {
    return game.allTiles;
  }

  return game.allTiles.filter((tile) => statuses.includes(tile.status));
};

const calculateValue = (tile: MinesweeperTile) => {
  if (tile.isMine) return;

  let value = 0;
  forAdjacent(tile, (adjacentTile) => {
    if (adjacentTile.isMine) {
      value++;
    }
  });

  tile.value = value;
};

export const getAdjacent = (
  tile: MinesweeperTile,
  ...statuses: TileStatus[]
): MinesweeperTile[] => {
  const { row, col, board } = tile;
  const adjacent: MinesweeperTile[] = [];

  // Don't exit matrix boundaries
  const rowStart = clamp(row - 1, 0, row);
  const rowEnd = clamp(row + 1, row, board.length - 1);

  // Don't exit matrix boundaries
  const colStart = clamp(col - 1, 0, col);
  const colEnd = clamp(col + 1, col, board[row].length - 1);

  // Go over all adjacent tiles
  for (let curRow = rowStart; curRow <= rowEnd; curRow++) {
    for (let curCol = colStart; curCol <= colEnd; curCol++) {
      const curTile = board[curRow][curCol];

      // Don't count self as a tile
      if (curTile !== tile && (statuses.length === 0 || statuses.includes(curTile.status))) {
        adjacent.push(curTile);
      }
    }
  }

  return adjacent;
};

export const forAdjacent = (tile: MinesweeperTile, fn: (tile: MinesweeperTile) => void) =>
  getAdjacent(tile).forEach(fn);

export const createMinesweeperTile = (
  board: MinesweeperTile[][],
  row: number,
  col: number,
): MinesweeperTile => ({
  row,
  col,
  board,
  value: 0,
  isMine: false,
  isPeaking: false,
  isLosingTile: false,
  status: 'hidden',
  flagCount: 0,
  isFinal: false,
});
