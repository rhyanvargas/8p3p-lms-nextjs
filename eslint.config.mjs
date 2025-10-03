import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	// Ignore patterns for the entire configuration
	{
		ignores: [
			".next/**/*",
			"node_modules/**/*",
			"public/**/*",
			"scripts/**/*",
			"videos/**/*",
			"**/*.min.js",
			"amplify/**/*",
			".amplify/**/*",
			"amplify_outputs*",
			"amplifyconfiguration*",
			".amazonq/**/*",
		],
	},
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			// Next.js 15+ specific rules
			"@next/next/no-async-client-component": "error",
			"@next/next/no-sync-scripts": "error",
			"@next/next/no-before-interactive-script-outside-document": "error",
			"@next/next/no-assign-module-variable": "error",

			// React 19 compatibility
			"react-hooks/exhaustive-deps": "warn",
			"react-hooks/rules-of-hooks": "error",

			// TypeScript strict rules
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true,
				},
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-expressions": [
				"warn",
				{
					allowShortCircuit: true,
					allowTernary: true,
					allowTaggedTemplates: true,
				},
			],
			"@typescript-eslint/no-this-alias": [
				"error",
				{
					allowDestructuring: true,
					allowedNames: ["self", "that"],
				},
			],
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-wrapper-object-types": "off",
			"@typescript-eslint/triple-slash-reference": [
				"error",
				{
					path: "always",
					types: "prefer-import",
					lib: "always",
				},
			],

			// Performance and best practices
			"@next/next/no-img-element": "error",
			"@next/next/no-page-custom-font": "warn",
		},
	},
];

export default eslintConfig;
