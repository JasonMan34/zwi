<script lang="ts">
  import { getNewBoard, type Board, type SimpleBoard, type Player, type Players, type Letter, getWinner } from '$lib';
  import SimpleTicTacToe, { type OnClickParams } from './SimpleTicTacToe.svelte';

  type QuantumSubGame = {
    winner: Player | null;
    board: SimpleBoard;
  };

  const players: Players = {
    X: { letter: 'X', name: 'Adam', color: '#00FF49' },
    O: { letter: 'O', name: 'Eve', color: '#FF0049' },
  };

  let activeBoardIndex: number | null = null;
  let currentPlayer: Letter = 'X';
  let winner: null;
  const games = Array(9)
    .fill(0)
    .map((_) => ({
      winner: null,
      board: getNewBoard(),
    })) as Board<QuantumSubGame>;

  const checkWinner = (game: QuantumSubGame) => {
    const winningLetter = getWinner(game.board);

    console.log(winningLetter);
    if (winningLetter) {
      game.winner = players[winningLetter];
    }
  };

  const clickCell = (gameIndex: number, cellIndex: number) => {
    games[gameIndex].board[cellIndex] = currentPlayer;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  };

  const changeActiveGame = (gameIndex: number) => {
    if (games[gameIndex].winner) {
      activeBoardIndex = null;
    } else {
      activeBoardIndex = gameIndex;
    }
  };

  const onClick = (e: CustomEvent<OnClickParams>) => {
    const { cellIndex, gameIndex } = e.detail;

    clickCell(gameIndex, cellIndex);
    checkWinner(games[gameIndex]);
    changeActiveGame(cellIndex);
  };
</script>

<div id="root">
  <nav id="navbar">Quantum Tic Tac Toe</nav>
  <main class="quantum-board board">
    {#each games as game, index}
      <div
        class="simple-game-wrapper"
        data-disabled={game.winner || (activeBoardIndex !== null && activeBoardIndex !== index)}
        data-index={index}
      >
        <SimpleTicTacToe board={game.board} gameIndex={index} winner={game.winner} on:click={onClick} />
      </div>
    {/each}
  </main>
</div>

<style lang="scss">
  @import 'mixins.scss';

  #root {
    height: 100svh;
    display: flex;
    flex-direction: column;
  }

  #navbar {
    display: flex;
    flex-direction: row;
    justify-content: center;

    width: 100%;
    padding: 12px;
    @include primary;
  }

  .simple-game-wrapper {
    padding: 0.25rem;

    &[data-disabled='true'] {
      :global(.simple-tic-tac-toe) {
        opacity: 0.3;
        pointer-events: none;
      }
    }

    @include board;
    border-color: blue;
  }

  .quantum-board {
    min-width: 0;
    min-height: 0;
    flex-grow: 1;
    aspect-ratio: 1;
    align-self: center;

    padding: 16px;
  }

  @media (orientation: portrait) {
    .quantum-board {
      flex-grow: 0;
      width: 95%;
    }
  }
</style>
