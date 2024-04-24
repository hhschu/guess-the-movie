<script>
	import './styles.css';
</script>

<div class="flex flex-col min-h-screen">
	<main class="flex flex-col w-full max-w-4xl h-max pt-3 mt-0 m-auto">
		<slot />
	</main>

	<footer class="flex flex-col justify-center items-center">
		<p class="text-xs">Powered by SDXL Lightning</p>
		<p class="text-xs">Made from Spain with ❤️</p>
	</footer>
</div>

<style>
	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
