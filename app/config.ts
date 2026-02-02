// Base path for assets - must match next.config.ts basePath
// Use NEXT_PUBLIC_ prefix so it's available in client components
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Helper to get asset path with basePath prefix
export function assetPath(path: string): string {
  return `${basePath}${path}`
}
