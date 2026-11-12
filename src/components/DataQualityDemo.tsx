import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { makeData, collect, predict, accuracy } from '../lib/sim';

const TRAIN = makeData(300, 1);
const TEST = makeData(400, 2);
const D = 3.5; // plot domain [-D, D]
const S = 300; // svg size
const G = 30; // decision grid resolution
const toPx = (v: number) => ((v + D) / (2 * D)) * S;
const COLORS = ['#3b82f6', '#f97316'];

export default function DataQualityDemo({ show = 'both' }: { show?: 'noise' | 'bias' | 'both' }) {
  const [noise, setNoise] = useState(0);
  const [bias, setBias] = useState(0);
  const train = useMemo(() => collect(TRAIN, { noise, bias }), [noise, bias]);
  const acc = useMemo(() => accuracy(train, TEST), [train]);
  const grid = useMemo(() => {
    const cells = [];
    for (let i = 0; i < G; i++)
      for (let j = 0; j < G; j++) {
        const x = -D + ((i + 0.5) * 2 * D) / G, y = -D + ((j + 0.5) * 2 * D) / G;
        cells.push({ i, j, c: predict(train, x, y) });
      }
    return cells;
  }, [train]);
  const curve = useMemo(
    () => Array.from({ length: 11 }, (_, k) => k * 0.05).map((n) => [n, accuracy(collect(TRAIN, { noise: n, bias }), TEST)]),
    [bias],
  );

  const cw = S / G;
  const cx = (n: number) => 30 + (n / 0.5) * 250, cy = (a: number) => 10 + (1 - a) * 2 * 150; // y axis 0.5..1

  return (
    <figure className="not-prose my-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <svg viewBox={`0 0 ${S} ${S}`} className="w-full rounded-lg" shapeRendering="crispEdges" role="img" aria-label="Training data and the model's decision regions">
          {grid.map(({ i, j, c }) => (
            <rect key={`${i}-${j}`} x={i * cw} y={S - (j + 1) * cw} width={cw + 0.5} height={cw + 0.5} fill={COLORS[c]} opacity={0.15} />
          ))}
          {train.map((p) => (
            <motion.circle
              key={p.u}
              cx={toPx(p.x)}
              cy={S - toPx(p.y)}
              r={p.flipped ? 4 : 2.6}
              fill={COLORS[p.label]}
              stroke={p.flipped ? 'currentColor' : 'none'}
              strokeWidth={1.2}
              initial={false}
              animate={{ fill: COLORS[p.label] }}
            />
          ))}
        </svg>

        <div className="flex flex-col gap-5 text-sm">
          {show !== 'bias' && (
            <label className="block">
              <span className="flex justify-between"><span>Mislabeled examples</span><b>{Math.round(noise * 100)}%</b></span>
              <input type="range" min={0} max={0.5} step={0.01} value={noise} onChange={(e) => setNoise(+e.target.value)} className="w-full accent-accent" />
            </label>
          )}
          {show !== 'noise' && (
            <label className="block">
              <span className="flex justify-between"><span>Orange examples missing from the top half</span><b>{Math.round(bias * 100)}%</b></span>
              <input type="range" min={0} max={1} step={0.01} value={bias} onChange={(e) => setBias(+e.target.value)} className="w-full accent-accent" />
            </label>
          )}
          <div>
            <div className="text-zinc-500">Accuracy on clean, representative test data</div>
            <motion.div key={Math.round(acc * 1000)} initial={{ scale: 0.95, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-bold tabular-nums">
              {(acc * 100).toFixed(1)}%
            </motion.div>
            <div className="text-zinc-500">{train.length} training examples collected</div>
          </div>
          <svg viewBox="0 0 300 185" className="w-full" role="img" aria-label="Accuracy as label noise grows">
            {[0.5, 0.75, 1].map((a) => (
              <g key={a}>
                <line x1={30} x2={280} y1={cy(a)} y2={cy(a)} stroke="currentColor" opacity={0.1} />
                <text x={0} y={cy(a) + 4} fontSize={10} fill="currentColor" opacity={0.6}>{a * 100}%</text>
              </g>
            ))}
            {[0, 0.25, 0.5].map((n) => (
              <text key={n} x={cx(n)} y={182} fontSize={10} textAnchor={n === 0 ? 'start' : n === 0.5 ? 'end' : 'middle'} fill="currentColor" opacity={0.6}>{n * 100}% noise</text>
            ))}
            <polyline points={curve.map(([n, a]) => `${cx(n)},${cy(Math.max(a, 0.5))}`).join(' ')} fill="none" stroke={COLORS[0]} strokeWidth={2} />
            <motion.circle animate={{ cx: cx(noise), cy: cy(Math.max(acc, 0.5)) }} r={5} fill={COLORS[1]} />
          </svg>
        </div>
      </div>
      <figcaption className="mt-4 text-xs text-zinc-500">
        A 7-nearest-neighbour classifier trained on the collected data. Shaded areas show what the model predicts; ringed points have a wrong label.
        The curve shows accuracy as label noise grows, at the current sampling bias.
      </figcaption>
    </figure>
  );
}
