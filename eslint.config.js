import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
	{
		ignores: [
			"**/build/**",
			"**/dist/**",
			"**/dev-dist/**",
			"**/node_modules/**",
			"**/test/**",
			"**/tmp/**",
			"**/vendor/**",
			"tailwind.config.ts",
			"vite.config.ts",
		],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		plugins: {
			"@typescript-eslint": tseslint.plugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-unsafe-argument": "error",
			"@typescript-eslint/no-unsafe-assignment": "error",
			"@typescript-eslint/no-unsafe-call": "error",
			"@typescript-eslint/no-unsafe-member-access": "error",
			"@typescript-eslint/no-unsafe-return": "error",
			"@typescript-eslint/no-floating-promises": "off",
			"@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
			"@typescript-eslint/no-unsafe-enum-comparison": "off",
		},
	},
	{
		files: ["**/*.js"],
		...tseslint.configs.disableTypeChecked,
	},
	eslintPluginPrettierRecommended,
);
