// Declares CSS files as valid side-effect imports for TypeScript.
// Fixes ts(2882): "Cannot find module or type declarations for side-effect import of '*.css'"
// This is required when using Tailwind v4 with moduleResolution: "bundler" in tsconfig.json.
declare module "*.css" {}