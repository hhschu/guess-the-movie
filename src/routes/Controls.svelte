<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { answer } from './stores.js';

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
	let status = '';
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

<div class="container flex flex-col w-full gap-y-4 h-24">
	{#if !end}
		<form class="w-full self-center text-center" on:submit|preventDefault={handleSubmit}>
			<input
				class="w-fit md:w-6/12 rounded-md p-2 mx-1"
				list="titles"
				type="text"
				bind:value={guess}
			/>
			<datalist id="titles">
				{#each titles as title}
					<option value={title}></option>
				{/each}
			</datalist>
			<button
				class="h-10 font-semibold rounded-md bg-rose-700 hover:bg-rose-600 py-2 px-4 border-b-4 border-rose-900 text-white"
				disabled={!isReady}>Guess</button
			>
			<button
				class="h-10 font-semibold rounded-md bg-slate-200 hover:bg-slate-300 py-2 px-4 border-b-4 border-slate-400 text-slate-900"
				on:click={handleGiveUp}
				disabled={!isReady}>Give up</button
			>
		</form>
	{/if}

	{#if status}
		{#key status}
			<p class="self-center py-1" in:fade>{status}</p>
		{/key}
	{/if}

	{#if end}
		<button
			class="self-center h-10 px-6 font-semibold rounded-md bg-black text-white"
			on:click={refresh}>New Game</button
		>
	{/if}
</div>
