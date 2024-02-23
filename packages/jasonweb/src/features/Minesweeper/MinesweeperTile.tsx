import { type MouseEventHandler, useMemo } from 'react';

import { type MinesweeperTile as MinesweeperTileInterface } from './game/minesweeper-tile';

// e.buttons & LMB - Primary is active in the event
// e.buttons & RMB - Secondary is active in the event
const LMB = 0x1;
const RMB = 0x2;

// e.button === LMC - Primary click (up or down) was involved in the event
// e.button === RMC - Secondary click (up or down) was involved in the event
const LMC = 0;
const RMC = 2;

export function MinesweeperTile({ tile }: { tile: MinesweeperTileInterface }) {
  const flagClass = useMemo(() => {
    if (tile.isFlagged) {
      if (tile.game.isGameLost && !tile.isMine) return 'ms-tile-flag-wrong';
      return 'ms-tile-flag';
    }

    if (!tile.isRevealed) {
      if (tile.isPeaking) return 'ms-tile-peaking';
      return 'ms-tile-hidden';
    }

    if (tile.isMine) {
      if (tile.isLosingTile) return 'ms-tile-mine-red';
      return 'ms-tile-mine';
    }

    if (tile.value === 0) return 'ms-tile-0';
    if (tile.value === 1) return 'ms-tile-1';
    if (tile.value === 2) return 'ms-tile-2';
    if (tile.value === 3) return 'ms-tile-3';
    if (tile.value === 4) return 'ms-tile-4';
    if (tile.value === 5) return 'ms-tile-5';
    if (tile.value === 6) return 'ms-tile-6';
    if (tile.value === 7) return 'ms-tile-7';
    return 'ms-tile-8';
  }, [
    tile.isFlagged,
    tile.game.isGameLost,
    tile.isMine,
    tile.isRevealed,
    tile.isPeaking,
    tile.isLosingTile,
    tile.value,
  ]);

  const onMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (e.button === LMC) {
      tile.peak();
    } else if (e.button === RMC && !tile.isRevealed) {
      // TODO: JASON Check if onContextMenu can work instead here
      // tile.flag();
    }
  };

  const onMouseUp: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (e.button === LMC) {
      if (tile.isPeaking) {
        tile.unpeak();
      }

      if (!tile.isFlagged) {
        tile.click();
      }
    }
  };

  const onMouseEnter: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isLmbDown = e.buttons & LMB; // eslint-disable-line no-bitwise
    const isRmbDown = e.buttons & RMB; // eslint-disable-line no-bitwise

    if (isLmbDown && !isRmbDown && tile.isPeaking) {
      tile.peak();
    } else if (isRmbDown && !isLmbDown) {
      tile.flag();
    }
  };

  const onMouseOut: MouseEventHandler<HTMLButtonElement> = (e) => {
    const isLmbDown = e.buttons & LMB; // eslint-disable-line no-bitwise

    if (isLmbDown && tile.isPeaking) {
      tile.unpeak();
    }
  };

  const onContextMenu: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!tile.isRevealed) {
      tile.flag();
    }
  };

  return (
    <button
      type="button"
      aria-label={`minesweeper-tile column ${tile.col} row ${tile.row}`}
      className={`ms-tile ${flagClass}`}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseOut={onMouseOut}
      onContextMenu={onContextMenu}
    />
  );
}

export default MinesweeperTile;
