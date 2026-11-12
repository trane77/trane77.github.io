// Run: node src/lib/vrp.test.ts
import assert from 'node:assert';
import { randomStops, construct, improveOnce, totalLength } from './vrp.ts';

const depot = { x: 0.5, y: 0.5 }, stops = randomStops(25, 7);
let routes = construct(depot, stops, 3);
assert.equal(routes.flat().length, 25, 'every stop visited once');
let len = totalLength(depot, routes), moves = 0;
for (let next; (next = improveOnce(depot, routes)); moves++) {
  const l = totalLength(depot, next);
  assert(l < len, 'each move shortens the plan');
  routes = next; len = l;
}
assert.equal(routes.flat().length, 25);
console.log({ moves, len });
