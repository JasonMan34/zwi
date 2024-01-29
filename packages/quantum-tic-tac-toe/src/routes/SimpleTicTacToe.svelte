<script lang="ts" context="module">
  export type OnClickParams = { cellIndex: number; gameIndex: number };
</script>

<script lang="ts">
  import { getWinner, type Letter, type Player, type Players, type SimpleBoard } from '$lib';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher<{ click: OnClickParams }>();

  // export let players: Players;
  export let winner: Player | null;
  export let board: SimpleBoard;
  export let gameIndex: number;
</script>

<div class="simple-tic-tac-toe">
  {#if winner}
    <div
      style={`font-size: 144px; display: flex; justify-content: center; align-items: center; height: 350px; color: ${winner.color}`}
    >
      {winner.letter}
    </div>
  {:else}
    <div class="board">
      {#each board as value, cellIndex}
        <button
          type="button"
          disabled={board[cellIndex] !== null}
          class="cell"
          data-index={cellIndex}
          on:click={() => dispatch('click', { cellIndex, gameIndex: gameIndex })}
        >
          {value || ''}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @import 'mixins.scss';

  .winner {
    margin-top: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  button.cell {
    background-color: transparent;
    @include board;
  }
</style>
