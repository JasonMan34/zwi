import { type MinesweeperGame } from './game/minesweeper-game';
import Tile from './MinesweeperTile';

function MinesweeperBoard({
  game,
  showIndexes = false,
}: {
  game: MinesweeperGame;
  showIndexes: boolean;
}) {
  return (
    <div className="minesweeper-board">
      {showIndexes && (
        <div className="flex flex-row ml-[28px]">
          {game.board[0].map((_, colIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={colIndex} className="w-[28px] text-center">
              {colIndex}
            </div>
          ))}
        </div>
      )}
      {game.board.map((row, rowIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={rowIndex} className="flex flex-row justify-center">
          {showIndexes && <div className="w-[28px] text-center">{rowIndex}</div>}
          {row.map((tile, colIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <Tile key={`${colIndex}-${tile.isRevealed}-${tile.isPeaking}`} tile={tile} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default MinesweeperBoard;
