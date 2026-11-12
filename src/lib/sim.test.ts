// Run: node src/lib/sim.test.ts
import assert from 'node:assert';
import { makeData, collect, accuracy } from './sim.ts';

const train = makeData(300, 1), test = makeData(400, 2);
const clean = accuracy(collect(train, { noise: 0, bias: 0 }), test);
const noisy = accuracy(collect(train, { noise: 0.4, bias: 0 }), test);
const biased = accuracy(collect(train, { noise: 0, bias: 0.9 }), test);
assert(clean > 0.8, `clean ${clean}`);
assert(noisy < clean - 0.1, `noisy ${noisy} vs clean ${clean}`);
assert(biased < clean, `biased ${biased} vs clean ${clean}`);
console.log({ clean, noisy, biased });
