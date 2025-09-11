"use client";

import { use } from "react";

/**
 * A custom hook that safely unwraps Next.js route parameters
 *
 * @param params - The route parameters object from Next.js (which is a Promise in Next.js 15+)
 * @returns The resolved parameters object
 *
 * @example
 * // In a page component:
 * export default function Page({ params }: { params: Promise<{ id: string }> }) {
 *   const { id } = useParams(params);
 *   // Now use id safely...
 * }
 */
export function useParams<T>(params: Promise<T>): T {
	return use(params);
}
