export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
		...(process.env.VITE_VERCEL_ENV === 'production' ? { cssnano: {} } : {})
	}
};
