import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	// Better Auth core tables
	dialect: "postgresql",
	schema: "./auth-schema.ts",
	out: "./drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
