<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes, APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Minimal-Change UI Rule

When the user requests a fix or enhancement to a specific section or component:

1. **Only touch what was explicitly requested.** Do not add features, diagrams, or content to sections the user did not mention.
2. **Never change shared component defaults** (e.g. Flow.tsx, ScrollStack.tsx prop defaults) to achieve a per-instance fix. Pass the prop at the call site instead.
3. **Never change SSR snapshot defaults** (e.g. `useSyncExternalStore` server return) without explicit discussion, these affect hydration safety.
4. **Visually verify mobile changes on a real mobile viewport** (390×844) before claiming success. If the layout looks broken, say so instead of claiming it's fine.
5. **Each pillar graphic (story, growth, founder) has a distinct intentional design.** Do not replace one pillar's graphic style with another's (e.g. don't put flow diagrams on the story pillar, it uses CardSwap; don't put flow diagrams on the founder pillar, it uses a LinkedIn card).

## UI Styling & Color Contrast Rules

1. **Avoid Conflicting Utility Classes in Template Strings**: When interpolating helper class variables (e.g. `${bubble} bg-accent-solid text-accent-ink`), ensure base helper classes do not contain conflicting background utilities like `bg-elevated` that override specified theme colors in CSS cascade order. Use explicit, isolated class strings for custom CTAs.
2. **Raster Logo Transparency**: For raster logo images (PNGs) displayed over paper canvas or card backgrounds, apply `mix-blend-multiply` in logo components so white image bounding boxes blend transparently with light theme grounds.
