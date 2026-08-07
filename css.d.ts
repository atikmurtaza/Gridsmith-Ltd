// Next declares `*.module.css` but not plain global stylesheets, and TypeScript 6
// errors on a side-effect import it cannot resolve. One declaration covers it.
declare module '*.css';
