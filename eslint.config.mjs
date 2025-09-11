import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Next.js 15+ specific rules
      "@next/next/no-async-client-component": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      
      // React 19 compatibility
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      
      // TypeScript strict rules
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Performance and best practices
      "@next/next/no-img-element": "error",
      "@next/next/no-page-custom-font": "warn",
    },
  },
];

export default eslintConfig;