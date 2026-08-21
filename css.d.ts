// Next declares `*.module.css` but not plain global stylesheets, and TypeScript 6 errors
// on a side-effect import it cannot resolve. One declaration covers both.
//
// It was `declare module '*.css';` — shorthand, no body — which types every import from
// it as `any`, banned by master/PROJECT-RULES.md §2. The first attempt at a fix was
// `declare module '*.css' {}`, on the reasoning that only side-effect imports use this
// declaration because "`*.module.css` is more specific, so it wins".
//
// **CI disproved that, and local typecheck did not.** Both patterns have a zero-length
// prefix before the `*`, so TypeScript's longest-prefix rule cannot separate them and
// `*.css` matched first — giving every CSS module an empty type and producing 100+
// TS2339 errors across the primitive layer. It passed locally only because
// `tsconfig.tsbuildinfo` served a cached result; a clean checkout is the honest test, and
// that is what the runner does.
//
// So the module gets a real type rather than no type. A readonly string map is what a CSS
// module actually is, it satisfies `styles.button`, and it keeps side-effect imports
// working — with no `any` anywhere.
declare module '*.css' {
  const styles: { readonly [className: string]: string };
  export default styles;
}
