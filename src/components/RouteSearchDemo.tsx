import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { randomStops, construct, improveOnce, totalLength, type P } from '../lib/vrp';

const DEPOT: P = { x: 0.5, y: 0.5 };
const COLORS = ['#3b82f6', '#f97316', '#10b981', '#a855f7'];
const S = 300;

export default function RouteSearchDemo() {
  const [seed, setSeed] = useState(7);
  const [vans, setVans] = useState(3);
  const stops = useMemo(() => randomStops(25, seed), [seed]);
  const [routes, setRoutes] = useState(() => construct(DEPOT, stops, vans));
  const [history, setHistory] = useState<number[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const r = construct(DEPOT, stops, vans);
    setRoutes(r);
    setHistory([totalLength(DEPOT, r)]);
    setRunning(false);
  }, [stops, vans]);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => {
      const next = improveOnce(DEPOT, routes);
      if (!next) return setRunning(false);
      setRoutes(next);
      setHistory((h) => [...h, totalLength(DEPOT, next)]);
    }, 250);
    return () => clearTimeout(t);
  }, [running, routes]);

  const path = (r: P[]) => [DEPOT, ...r, DEPOT].map((p, i) => `${i ? 'L' : 'M'}${p.x * S},${p.y * S}`).join(' ');
  const first = history[0] ?? 1, last = history[history.length - 1] ?? 1;
  const max = Math.max(...history), min = Math.min(...history);
  const chart = history.map((v, i) => `${(i / Math.max(history.length - 1, 1)) * 280 + 10},${70 - ((v - min) / (max - min || 1)) * 60}`).join(' ');

  return (
    <figure className="not-prose my-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-lg bg-zinc-50 dark:bg-zinc-900" role="img" aria-label="Van routes from the depot">
          {routes.map((r, v) => (
            <motion.path key={v} d={path(r)} animate={{ d: path(r) }} fill="none" stroke={COLORS[v]} strokeWidth={2} strokeLinejoin="round" />
          ))}
          {stops.map((p, i) => <circle key={i} cx={p.x * S} cy={p.y * S} r={3.5} className="fill-zinc-700 dark:fill-zinc-200" />)}
          <rect x={DEPOT.x * S - 6} y={DEPOT.y * S - 6} width={12} height={12} rx={2} className="fill-zinc-900 dark:fill-white" />
        </svg>
        <div className="flex flex-col gap-4 text-sm">
          <label className="block">
            <span className="flex justify-between"><span>Vans</span><b>{vans}</b></span>
            <input type="range" min={1} max={4} value={vans} onChange={(e) => setVans(+e.target.value)} className="w-full accent-accent" />
          </label>
          <div className="flex gap-2">
            <button onClick={() => setRunning(!running)} className="rounded-full bg-accent text-white px-4 py-1.5 hover:opacity-90">
              {running ? 'Pause' : history.length > 1 && !improveOnce(DEPOT, routes) ? 'Local optimum reached' : 'Run search'}
            </button>
            <button onClick={() => setSeed(seed + 1)} className="rounded-full border border-zinc-300 dark:border-zinc-700 px-4 py-1.5 hover:border-accent">
              New stops
            </button>
          </div>
          <div>
            <div className="text-zinc-500">Total route length</div>
            <div className="text-4xl font-bold tabular-nums">{(last * 10).toFixed(2)} km</div>
            <div className="text-zinc-500">
              {history.length - 1} improving moves · {(((first - last) / first) * 100).toFixed(1)}% shorter than the first plan
            </div>
          </div>
          <svg viewBox="0 0 300 80" className="w-full" role="img" aria-label="Route length after each move">
            <line x1={10} x2={290} y1={75} y2={75} stroke="currentColor" opacity={0.15} />
            <polyline points={chart} fill="none" stroke={COLORS[0]} strokeWidth={2} />
          </svg>
        </div>
      </div>
      <figcaption className="mt-4 text-xs text-zinc-500">
        Toy version of the classical baseline: stops are split among vans by angle, ordered nearest-first, then improved with 2-opt moves
        (reverse a stretch of a route when that makes it shorter). Distances are straight lines on a 10 km square, not real roads.
      </figcaption>
    </figure>
  );
}
