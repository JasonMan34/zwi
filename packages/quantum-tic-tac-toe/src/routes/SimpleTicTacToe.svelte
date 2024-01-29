<script lang="ts" context="module">
  export type OnClickParams = { index: number };
</script>

<script lang="ts">
  import { type Player, type SimpleBoard } from '$lib';
  import { createEventDispatcher } from 'svelte';

  export let board: SimpleBoard;
  export let winner: Player | null;

  const dispatch = createEventDispatcher<{ click: OnClickParams }>();
</script>

<div class="simple-tic-tac-toe">
  {#if winner}
    <p class="winner">Winner: {winner}</p>
  {/if}

  <div class="board">
    {#each board as value, index}
      <button type="button" class="cell" data-index={index} on:click={() => dispatch('click', { index })}
        >{value || ''}</button
      >
    {/each}
  </div>
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
