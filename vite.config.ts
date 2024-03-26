import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		nodePolyfills(),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			devOptions: {
				enabled: true,
			},
			workbox: {
				globPatterns: ["./**/*.js"],
			},
			includeAssets: [
				"favicon.ico",
				"apple-touch-icon-180x180.png",
				"maskable-icon-512x512.svg",
				"pwa-64x64.png",
				"pwa-192x192.png",
				"pwa-512x512.png",
				"logo.svg",
			],
			manifest: {
				name: "Image App",
				short_name: "Image App",
				description: "Image upload example app.",
				theme_color: "#ffffff",
				icons: [
					{
						src: "pwa-64x64.png",
						sizes: "64x64",
						type: "image/png",
					},
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "maskable-icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
