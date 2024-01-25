<script lang="ts">
  import { type Player, type SimpleBoard } from '$lib';
  import { createEventDispatcher } from 'svelte';

  export let board: SimpleBoard;
  export let winner: Player | null;

  const dispatch = createEventDispatcher();
</script>

<div class="simple-tic-tac-toe">
  {#if winner}
    <p class="winner">Winner: {winner}</p>
  {/if}

  <div class="board">
    {#each board as value, index (index)}
      <button type="button" class="cell" on:click={() => dispatch('click', { index })}>{value || ''}</button>
    {/each}
  </div>
</div>

<style>
  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    max-width: 300px;
    margin: 20px auto;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    background-color: #ddd;
  }

  .cell:hover {
    background-color: #ccc;
  }

  .winner {
    margin-top: 10px;
    font-size: 20px;
    font-weight: bold;
  }
</style>
