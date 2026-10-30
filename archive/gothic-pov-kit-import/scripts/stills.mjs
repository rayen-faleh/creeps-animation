// Render review stills of a composition at chosen times (seconds) into out/stills/<id>/.
// usage: node scripts/stills.mjs <CompositionId> <t1> <t2> ... [--scale=0.4]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const id = args.shift();
const scale = Number((args.find((a) => a.startsWith('--scale=')) || '--scale=0.4').split('=')[1]);
const times = args.filter((a) => !a.startsWith('--')).map(Number);
const exe = process.env.REMOTION_BROWSER;
const outDir = path.join('out', 'stills', id);
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', exe ? {browserExecutable: exe, chromeMode: 'headless-shell'} : {});
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
for (const t of times) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(t * composition.fps));
  await renderStill({composition, serveUrl, frame, scale, puppeteerInstance: browser, output: path.join(outDir, `f${String(frame).padStart(5, '0')}.png`)});
}
await browser.close({silent: true});
console.log(`${times.length} stills -> ${outDir}`);
