import './styles.scss';

import { useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming react-router-dom is used for routing

import { useForceUpdate } from '../../hooks/useForceUpdate';
import { AutoPlayer } from './game/auto-player';
import { MinesweeperGame } from './game/minesweeper-game';
import { sleep } from './game/utils';
import MinesweeperBoard from './MinesweeperBoard';

const HEIGHT = 16;
const WIDTH = 30;
const MINE_COUNT = 99;

export function Component() {
  const location = useLocation();
  const isSandbox = location.pathname.includes('sandbox');

  const [showIndexes, setShowIndexes] = useState(false);
  const [autoPlaySafe, setAutoPlaySafe] = useState(false);
  const [restartOnFailure, setRestartOnFailure] = useState(true);
  const [playerSpeed, setPlayerSpeed] = useState(10);

  const autoPlayerDelay = useMemo(() => Math.round(101 - 10 * playerSpeed), [playerSpeed]);

  const forceUpdate = useForceUpdate();
  const [game, setGame] = useState(() => {
    const innerGame = new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox);

    const startTimer = () => {
      timeInterval.current = setInterval(() => {
        setTime((p) => p + 1);
      }, 1000);
    };

    const stopTimer = () => {
      if (timeInterval.current) {
        clearInterval(timeInterval.current);
      }
    };

    innerGame.onGameInit(startTimer);
    innerGame.onGameLose(stopTimer);
    innerGame.onGameWin(stopTimer);
    innerGame.onUpdate(() => {
      console.log('I was called');
      forceUpdate();
    });

    return innerGame;
  });
  const [player, setPlayer] = useState(() => new AutoPlayer(game, !autoPlaySafe));

  const [time, setTime] = useState(0);
  const timeInterval = useRef<number | null>(null);

  const newGame = () => {
    setGame(new MinesweeperGame(WIDTH, HEIGHT, MINE_COUNT, isSandbox));
    setPlayer(new AutoPlayer(game, !autoPlaySafe));
    setTime(0);

    const startTimer = () => {
      timeInterval.current = setInterval(() => {
        setTime((p) => p + 1);
      }, 1000);
    };

    const stopTimer = () => {
      if (timeInterval.current) {
        clearInterval(timeInterval.current);
      }
    };

    game.onGameInit(startTimer);
    game.onGameLose(stopTimer);
    game.onGameWin(stopTimer);
    game.onUpdate(forceUpdate);
  };

  const autoPlay = async () => {
    if (game.isGameLost) {
      newGame();
    }

    player.autoPlay(autoPlayerDelay);

    while (restartOnFailure && !game.isGameWon) {
      // eslint-disable-next-line no-await-in-loop
      await game.waitForEnd();
      if (!autoPlaySafe && restartOnFailure && game.isGameLost) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(200);
        newGame();
        player.autoPlay(autoPlayerDelay);
      }
    }
  };

  const getDigitClass = (value: number, index: number) =>
    `ms-digit ms-digit-${value.toString().padStart(3, '0')[index]}`;

  const smileyClass = useMemo(() => {
    if (game.isGameWon) return 'ms-face ms-face-won';
    if (game.isGameLost) return 'ms-face ms-face-lost';
    return 'ms-face ms-face-neutral';
  }, [game.isGameWon, game.isGameLost]);

  return (
    <div id="minesweeper-wrapper" className="flex flex-col justify-center mt-16" dir="ltr">
      <div className="flex flex-row justify-center px-4 space-x-3">
        <div className="flex flex-col space-y-2">
          <div>
            <label className="inline-block" htmlFor="showIndexesCheckbox">
              <input
                id="showIndexesCheckbox"
                type="checkbox"
                checked={showIndexes}
                onChange={(e) => setShowIndexes(e.target.checked)}
              />
              Show indexes
            </label>
          </div>
          <div>
            <label className="inline-block" htmlFor="autoPlayerShouldGuessCheckbox">
              <input
                id="autoPlayerShouldGuessCheckbox"
                type="checkbox"
                checked={autoPlaySafe}
                onChange={(e) => setAutoPlaySafe(e.target.checked)}
              />
              Only play safe moves
            </label>
          </div>
          {!autoPlaySafe && (
            <div>
              <label className="inline-block" htmlFor="restartOnFailureCheckbox">
                <input
                  id="restartOnFailureCheckbox"
                  type="checkbox"
                  checked={restartOnFailure}
                  onChange={(e) => setRestartOnFailure(e.target.checked)}
                />
                Restart on failure
              </label>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="playerSpeed">
              <input
                id="playerSpeed"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="number"
                max="10"
                min="1"
                value={playerSpeed}
                onChange={(e) => setPlayerSpeed(Number(e.target))}
              />
              Player speed
            </label>
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-800 font-semibold rounded-lg p-4 text-white"
            onClick={autoPlay}
          >
            Auto play
          </button>
        </div>
        <div className="ms-container">
          {game.isGameWon && <span>You win! 🥳🥳🥳</span>}
          <div className="flex flex-row">
            <div className="ms-border-corner ms-border-top-left" />
            <div className="flex-1 ms-border-horizontal" />
            <div className="ms-border-corner ms-border-top-right" />
          </div>
          <div className="bg-black flex flex-row justify-center items-center">
            <div className="ms-border-vertical self-stretch" />
            <div className="ms-score">
              <div className={getDigitClass(game.minesLeft, 0)} />
              <div className={getDigitClass(game.minesLeft, 1)} />
              <div className={getDigitClass(game.minesLeft, 2)} />
            </div>
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="ms-new-game-wrapper flex-1 flex justify-center" onClick={newGame}>
              <button type="button" aria-label="New Game" className={smileyClass} />
            </div>
            <div className="ms-score">
              <div className={getDigitClass(time, 0)} />
              <div className={getDigitClass(time, 1)} />
              <div className={getDigitClass(time, 2)} />
            </div>
            <div className="ms-border-vertical self-stretch" />
          </div>
          <div className="flex flex-row">
            <div className="ms-border-vertical" />
            <div className="ms-inner">
              <MinesweeperBoard game={game} showIndexes={showIndexes} />
            </div>
            <div className="ms-border-vertical" />
          </div>
          <div className="flex flex-row">
            <div className="ms-border-corner ms-border-bottom-left" />
            <div className="flex-1 ms-border-horizontal" />
            <div className="ms-border-corner ms-border-bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

Component.displayName = 'Minesweeper';

export default Component;
