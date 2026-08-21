#!/usr/bin/env node
/**
 * with-server
 *
 * Starts the production server, runs each command given to it, stops the server, and
 * exits non-zero if any command failed.
 *
 * This exists so `npm run verify` can run every gate. There are **fourteen** — this
 * comment said ten, which was the count before `check:contrast`, `check:responsive` and
 * the Lighthouse split. `verify` used to run five of them and say nothing about the rest:
 * the three that need a build and the two that need a running server. CI ran everything,
 * so merges were safe, but a developer running the script named "verify" got a third of
 * the coverage with no indication of it, which is the same unearned confidence as a gate
 * that measures nothing. `check-node-version.mjs` now asserts that this list and the CI
 * step list are the same set.
 *
 * `next` is spawned directly rather than through npm so there is one process to stop.
 * An npm wrapper leaves the server orphaned on Windows when the parent is killed.
 */
import { spawn, spawnSync } from 'node:child_process';
import { lhciSkipped, UNAVAILABLE_ON_WINDOWS } from './lhci-availability.mjs';

const PORT = process.env.VERIFY_PORT ?? '3000';
const BASE = `http://127.0.0.1:${PORT}`;
const commands = process.argv.slice(2);

if (commands.length === 0) {
  console.error('with-server: nothing to run. Pass one or more commands.');
  process.exit(1);
}

/**
 * Refuse to share the port.
 *
 * `ready()` below polls until something answers 200 at BASE. If anything is *already*
 * listening there, that something is what every served gate then measures. This is not
 * hypothetical: it happened on 12 August. Another project's `next dev` was on 3000, and
 * `check-axe` dutifully reported two `label` violations and a missing `data-division` on
 * "/" — a critical failure, against an application that is not this one.
 *
 * A false red is the harmless direction. **The dangerous one is a stale `next start` of
 * THIS app**, left over from an earlier run: it answers 200 on every route, serves the
 * previous build, and every gate goes green against code that is no longer in the tree.
 * Nothing in the output would say so.
 *
 * So the port is a precondition, checked before spawning, rather than something to sniff
 * afterwards.
 */
try {
  await fetch(BASE + '/', { signal: AbortSignal.timeout(2000) });
  console.error(
    `\nwith-server: something is already listening on ${BASE}.` +
      '\n\nIt was not started by this script, so the served gates would measure it instead of' +
      '\nthis build — a stale server of this app answers every route and turns them all green' +
      '\nagainst the previous build.' +
      '\n\nStop it, or run on another port: VERIFY_PORT=3100 npm run verify\n',
  );
  process.exit(1);
} catch {
  // Nothing listening. That is the only acceptable starting state.
}

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', PORT], {
  stdio: 'ignore',
});

const stop = () => {
  if (!server.killed) server.kill();
};
process.on('exit', stop);
process.on('SIGINT', () => {
  stop();
  process.exit(130);
});

async function ready(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) return false;
    try {
      const res = await fetch(BASE + '/');
      // 200 is not enough — it has to be *this* application. Closes the race between the
      // pre-flight check above and the moment our own server binds.
      if (res.ok && (await res.text()).includes('data-division=')) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

if (!(await ready())) {
  console.error(`\nwith-server: server did not become ready at ${BASE}. Did \`npm run build\` succeed?\n`);
  stop();
  process.exit(1);
}

let failed = 0;
for (const command of commands) {
  console.log(`\n> ${command}`);
  const result = spawnSync(command, { shell: true, stdio: 'inherit', env: { ...process.env, AXE_BASE_URL: BASE } });
  if (result.status !== 0) failed += 1;
}

stop();

// The skip is reported in the summary rather than left in the scrollback. A gate that did
// not run is a fact about this verification, and burying it three hundred lines up is how
// "all green" comes to mean "all green except the two nobody mentions".
if (lhciSkipped) {
  console.log(
    '\n' + '─'.repeat(78) +
      '\n  ⚠  NOT ALL GATES RAN — Lighthouse desktop and mobile were SKIPPED on Windows.' +
      `\n     ${UNAVAILABLE_ON_WINDOWS.reason}` +
      `\n     ${UNAVAILABLE_ON_WINDOWS.where}` +
      '\n     A local pass here is not evidence for those two — CI is (VALIDATION §13).' +
      '\n' + '─'.repeat(78) + '\n',
  );
}

if (failed > 0) {
  console.error(`\nwith-server: ${failed} of ${commands.length} command(s) failed.\n`);
  process.exit(1);
}
