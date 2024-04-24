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

<section>
	<h1 class="text-3xl font-bold">Guess the Movie</h1>
	<p>
		These AI images are generated based the plot of an <a href="https://www.imdb.com/chart/top/"
			>IMDb Top 250 Movie</a
		>. Which one is it?
	</p>

	{#await promise}
		<div class="container mx-auto px-4">
			<Spinner />
		</div>
	{:then movie}
		<div class="container mx-auto px-4">
			{#each movie.images as image}
				<img src={image.url} alt={image.caption} title={image.caption} />
			{/each}
		</div>
		<p
			style="font-family: 'Snell Roundhand'; font-size: 1.2rem; text-align: center; margin-top: 10px;"
		>
			{movie.genres.join(' · ')}
		</p>
	{/await}
	<Controls {titles} on:refresh={refresh} />
</section>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.100);
	}

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	img {
		width: auto;
		height: 512px;
	}

	.container {
		height: 512px;
		width: 768px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
