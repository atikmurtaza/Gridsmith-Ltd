// Next declares `*.module.css` but not plain global stylesheets, and TypeScript 6
// errors on a side-effect import it cannot resolve. One declaration covers it.
// `declare module '*.css';` — shorthand, no body — types every import from it as `any`,
// which master/PROJECT-RULES.md §2 bans outright. Only side-effect imports use it
// (`import '@/styles/globals.css'`), and `*.module.css` still resolves to Next's typed
// declaration because the more specific pattern wins, so nothing was unsound. An empty
// body costs two characters and removes the `any`.
declare module '*.css' {}
