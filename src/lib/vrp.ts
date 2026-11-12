// Toy routing for the vrp-ai-bench page: sweep + nearest-neighbour construction, then 2-opt improvement.
export type P = { x: number; y: number };

export function randomStops(n: number, seed: number): P[] {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647); // Park–Miller
  return Array.from({ length: n }, () => ({ x: 0.05 + r() * 0.9, y: 0.05 + r() * 0.9 }));
}

const d = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);

export const routeLength = (depot: P, route: P[]) =>
  route.reduce((sum, p, i) => sum + d(i ? route[i - 1] : depot, p), 0) + (route.length ? d(route[route.length - 1], depot) : 0);

export const totalLength = (depot: P, routes: P[][]) => routes.reduce((s, r) => s + routeLength(depot, r), 0);

// Split stops into `vans` angular sectors around the depot, then order each by nearest neighbour.
export function construct(depot: P, stops: P[], vans: number): P[][] {
  const angle = (p: P) => Math.atan2(p.y - depot.y, p.x - depot.x);
  const sorted = [...stops].sort((a, b) => angle(a) - angle(b));
  const size = Math.ceil(sorted.length / vans);
  return Array.from({ length: vans }, (_, v) => {
    const left = sorted.slice(v * size, (v + 1) * size);
    const route: P[] = [];
    let cur = depot;
    while (left.length) {
      let best = 0;
      left.forEach((p, i) => d(cur, p) < d(cur, left[best]) && (best = i));
      cur = left.splice(best, 1)[0];
      route.push(cur);
    }
    return route;
  });
}

// One first-improvement 2-opt move on any route; null when no move improves (local optimum).
export function improveOnce(depot: P, routes: P[][]): P[][] | null {
  for (let v = 0; v < routes.length; v++) {
    const r = routes[v];
    const before = routeLength(depot, r);
    for (let i = 0; i < r.length - 1; i++)
      for (let j = i + 1; j < r.length; j++) {
        const cand = [...r.slice(0, i), ...r.slice(i, j + 1).reverse(), ...r.slice(j + 1)];
        if (routeLength(depot, cand) < before - 1e-9) return routes.map((x, k) => (k === v ? cand : x));
      }
  }
  return null;
}
