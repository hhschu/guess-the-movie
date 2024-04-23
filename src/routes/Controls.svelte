<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { answer } from './stores.js';
	import AutoComplete from 'simple-svelte-autocomplete';

	const dispatch = createEventDispatcher();

	export let titles;

	const config = {
		placeHolder: 'Search for Food...',
		data: {
			src: titles
		},
		resultItem: {
			highlight: true
		}
	};

	$: isReady = answer !== '';
	let guess = '';
	const maxGuesses = 10;
	let status;
	let end = false;
	let guessed = new Set();

	Array.prototype.random = function () {
		return this[Math.floor(Math.random() * this.length)];
	};

	function handleSubmit() {
		if (guess == '') {
			return;
		}

		if (guessed.has(guess)) {
			status = `You've already tried '${guess}'`;
		} else if (guess != $answer) {
			if (guessed.length >= maxGuesses) {
				handleGiveUp();
			} else {
				status = ['Nope', 'Wrong', 'Try again', 'Incorrect', 'No joy'].random();
				guessed.add(guess);
			}
		} else {
			status = '🎉';
			end = true;
		}
	}

	function handleGiveUp() {
		status = `It's "${$answer}"`;
		end = true;
	}

	export function refresh() {
		dispatch('refresh');
		guess = '';
		answer.set('');
		status = null;
		end = false;
		guessed = new Set();
	}
</script>

{#if !end}
	<form on:submit|preventDefault={handleSubmit}>
		<AutoComplete items={titles} bind:selectedItem={guess} bind:value={guess} />
		<button
			class="h-10 px-6 font-semibold rounded-md bg-red-700 hover:bg-red-900 text-white"
			disabled={!isReady}>Guess</button
		>
		<button
			class="h-10 px-6 font-semibold rounded-md border border-slate-200 hover:bg-zinc-200 bg-zinc-50 text-slate-900"
			on:click={handleGiveUp}
			disabled={!isReady}>Give up</button
		>
	</form>
{/if}

{#if status}
	{#key status}
		<p in:fade>{status}</p>
	{/key}
{/if}

{#if end}
	<button class="h-10 px-6 font-semibold rounded-md bg-black text-white" on:click={refresh}
		>New Game</button
	>
{/if}
