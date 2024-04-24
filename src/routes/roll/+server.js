import { json } from '@sveltejs/kit';
import { FAL_KEY, TMDB_KEY } from '$env/static/private';
import movies from '$lib/server/movies.json';
import * as fal from '@fal-ai/serverless-client';

fal.config({
	credentials: FAL_KEY
});

const genres = {
	12: 'Adventure',
	14: 'Fantasy',
	16: 'Animation',
	18: 'Drama',
	27: 'Horror',
	28: 'Action',
	35: 'Comedy',
	36: 'History',
	37: 'Western',
	53: 'Thriller',
	80: 'Crime',
	99: 'Documentary',
	878: 'Science Fiction',
	9648: 'Mystery',
	10402: 'Music',
	10749: 'Romance',
	10751: 'Family',
	10752: 'War',
	10770: 'TV Movie'
};

Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)];
};

function randomSeed() {
	return Math.floor(Math.random() * 10000000).toFixed(0);
}

async function generateImages(prompt) {
	const input = {
		_force_msgpack: new Uint8Array([]),
		image_size: 'portrait_4_3',
		sync_mode: true,
		num_images: 2,
		num_inference_steps: '2',
		prompt: `cinematic still of ${prompt} emotional, harmonious, vignette, color, highly detailed, high budget, bokeh, cinemascope, moody, epic, gorgeous, film grain, grainy.`,
		negative_promptstring:
			'anime, cartoon, graphic, text, painting, crayon, graphite, abstract, glitch, deformed, mutated, ugly, disfigured',
		seed: randomSeed()
	};

	const result = await fal.subscribe('fal-ai/fast-lightning-sdxl', {
		input: input
	});

	let images = [];

	for (const image of result.images) {
		images.push({ url: image.url });
	}

	return images;
}

export async function GET() {
	const selected = movies.random();
	const res = await fetch(
		`https://api.themoviedb.org/3/find/${selected.imdbId}?external_source=imdb_id`,
		{
			headers: { Authorization: `Bearer ${TMDB_KEY}` }
		}
	);
	const results = await res.json();
	const detail = results.movie_results[0];
	const images = await generateImages(detail.overview);
	return json({
		title: selected.title,
		genres: detail.genre_ids.map((x) => genres[x]),
		images: images
	});
}
