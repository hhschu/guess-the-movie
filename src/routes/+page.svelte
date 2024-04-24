<script>
	import { answer } from './stores.js';
	import Controls from './Controls.svelte';
	import Spinner from './Spinner.svelte';

	export let data;

	const titles = data.movies.map((m) => m.title);

	async function roll() {
		const res = await fetch(`/roll`);
		const movie = await res.json();
		answer.set(movie.title);
		return movie;
	}

	let promise = roll();

	async function refresh() {
		promise = roll();
	}
</script>

<svelte:head>
	<title>Guess The Movie</title>
	<meta name="description" content="Guess a movie from AI generated posters." />
</svelte:head>

<section class="flex flex-col justify-center items-center">
	<h1 class="text-4xl font-bold pt-3">Guess the Movie</h1>
	<p class="text-center w-4/5 m-auto py-3">
		These AI images are generated from the plot of an <a href="https://www.imdb.com/chart/top/"
			>IMDb Top 250 Movie</a
		>. Which one is it?
	</p>

	{#await promise}
		<div
			class="container flex w-full aspect-[4/3] max-h-[512px] justify-center items-center mx-auto px-4"
		>
			<Spinner />
		</div>
	{:then movie}
		<div class="container flex w-full md:w-fit mx-auto px-4">
			{#each movie.images as image}
				<div>
					<img
						class="object-scale-down max-h-[512px]"
						src={image.url}
						alt={image.caption}
						title={image.caption}
					/>
				</div>
			{/each}
		</div>
		<p class="font-['Snell_Roundhand'] text-xl text-center m-auto py-3">
			{movie.genres.join(' · ')}
		</p>
	{/await}
	<Controls {titles} on:refresh={refresh} />
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}
</style>
