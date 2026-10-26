/** CSS hexadecimal colour literals supported by the repository's colour policy. */
const VALID_HEX_LENGTHS = new Set([3, 4, 6, 8]);

/** Return unsupported hex-shaped CSS hash tokens in declaration values. */
export function invalidHexLiterals(css) {
  const blanked = css.replace(/\/\*[\s\S]*?\*\/|'[^'\n]*'|"[^"\n]*"/g, (m) =>
    m.replace(/[^\n]/g, ' '),
  );
  const values = [...blanked].map((ch) => (ch === '\n' ? '\n' : ' '));
  let inValue = false;
  for (let i = 0; i < blanked.length; i += 1) {
    const ch = blanked[i];
    if (ch === ':') inValue = true;
    else if (ch === ';' || ch === '{' || ch === '}') inValue = false;
    else if (inValue) values[i] = ch;
  }
  const declarationText = values.join('').replace(/url\([^)]*\)/gi, (m) => m.replace(/[^\n]/g, ' '));
  const invalid = [];
  const hashes = /#([\w-]+)/g;
  let match;
  while ((match = hashes.exec(declarationText)) !== null) {
    if (!/^[0-9a-f]+$/i.test(match[1])) continue;
    if (!VALID_HEX_LENGTHS.has(match[1].length)) {
      invalid.push({ value: `#${match[1]}`, index: match.index });
    }
  }
  return invalid;
}
