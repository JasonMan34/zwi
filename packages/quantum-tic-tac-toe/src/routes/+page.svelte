<script lang="ts">
  import { getNewBoard, type Board, type SimpleBoard, type Player } from '$lib';
  import SimpleTicTacToe, { type OnClickParams } from './SimpleTicTacToe.svelte';

  type QuantumSubGame = {
    winner: Player | null;
    board: SimpleBoard;
  };

  const players: [Player, Player] = [
    { name: 'X', letter: 'X' },
    { name: 'O', letter: 'O' },
  ];

  let activeBoardIndex = 0;
  let currentPlayerIndex = 0;
  let winner: null;
  const simpleGames = Array(9)
    .fill(0)
    .map((_) => ({
      winner: null,
      board: getNewBoard(),
    })) as Board<QuantumSubGame>;

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const onClick = (e: CustomEvent<OnClickParams>) => {
    simpleGames[activeBoardIndex].board[e.detail.index] = getCurrentPlayer().letter;
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    activeBoardIndex++;
    activeBoardIndex %= 9;
  };
</script>

<div id="root">
  <nav id="navbar">Quantum Tic Tac Toe</nav>
  <main class="quantum-board board">
    {#each simpleGames as simpleGame}
      <SimpleTicTacToe board={simpleGame.board} winner={simpleGame.winner} on:click={onClick} />
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

  .quantum-board {
    min-width: 0;
    min-height: 0;
    flex-grow: 1;
    aspect-ratio: 1;
    align-self: center;

    :global(.simple-tic-tac-toe) {
      border: 2px solid red;
    }
  }

  @media (orientation: portrait) {
    .quantum-board {
      flex-grow: 0;
      width: 95%;
    }
  }
</style>
