import movies from '$lib/server/movies.json';

export async function load() {
	return { movies: movies };
}
