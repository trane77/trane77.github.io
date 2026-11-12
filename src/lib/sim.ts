// Tiny deterministic simulation for the data-quality study:
// two overlapping Gaussian classes, a k-NN classifier, and controllable data defects.

export type Point = { x: number; y: number; label: 0 | 1; u: number; v: number };

function rng(seed: number) {
  // mulberry32
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeData(n: number, seed: number): Point[] {
  const r = rng(seed);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  return Array.from({ length: n }, (_, i) => {
    const label = (i % 2) as 0 | 1;
    const cx = label ? 1 : -1;
    // u, v: fixed per-point draws, so moving a slider changes the data smoothly instead of reshuffling it
    return { x: cx + gauss() * 0.9, y: gauss() * 0.9, label, u: r(), v: r() };
  });
}

export type Defects = { noise: number; bias: number };

// Training set as it would be *collected*: some labels flipped, and class 1 under-sampled where y > 0.
export function collect(data: Point[], { noise, bias }: Defects) {
  return data
    .filter((p) => !(p.label === 1 && p.y > 0 && p.v < bias))
    .map((p) => ({ ...p, flipped: p.u < noise, label: (p.u < noise ? 1 - p.label : p.label) as 0 | 1 }));
}

// ponytail: brute-force k-NN, O(train) per query; fine for a few hundred points.
export function predict(train: { x: number; y: number; label: 0 | 1 }[], x: number, y: number, k = 7): 0 | 1 {
  const near = train
    .map((p) => [(p.x - x) ** 2 + (p.y - y) ** 2, p.label] as const)
    .sort((a, b) => a[0] - b[0])
    .slice(0, k);
  return near.filter(([, l]) => l === 1).length * 2 > near.length ? 1 : 0;
}

export function accuracy(train: Parameters<typeof predict>[0], test: Point[]) {
  return test.filter((p) => predict(train, p.x, p.y) === p.label).length / test.length;
}
