<script lang="ts">
  import { getNewBoard, type Board, type SimpleBoard, type Player } from '$lib';
  import SimpleTicTacToe from './SimpleTicTacToe.svelte';

  type QuantumSubGame = {
    winner: Player | null;
    board: SimpleBoard;
  };

  type QuantumGame = {
    players: [Player, Player];
    currentPlayer: Player;
    winner: Player | null;
    boards: Board<QuantumSubGame>;
  };

  const game: QuantumGame = {
    players: [] as any,
    currentPlayer: {} as any,
    winner: null,
    boards: Array(9)
      .fill(0)
      .map((_) => ({
        winner: null,
        board: getNewBoard(),
      })) as Board<QuantumSubGame>,
  };
</script>

<nav id="navbar">Quantum Tic Tac Toe</nav>
<main class="quantum-board">
  {#each game.boards as board}
    <SimpleTicTacToe board={board.board} winner={board.winner}/>
  {/each}
</main>

<style lang="scss">
  @import 'mixins.scss';

  #navbar {
    display: flex;
    flex-direction: row;
    justify-content: center;

    width: 100%;
    padding: 12px;
    @include primary;
  }

  main :global(.simple-tic-tac-toe) {
    display: inline-block;
    width: 30%;
    border: 2px solid red;
  }
</style>
