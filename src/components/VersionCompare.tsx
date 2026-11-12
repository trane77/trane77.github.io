import { useState } from 'react';

// ponytail: hand-written sample history, just to show how the Versions tab compares two exports.
const versions = [
  { id: 'v1', label: 'Mon 10:12 · first print', s: { layer_height: 0.2, infill: 15, wall_loops: 2, nozzle_temp: 210, support: 'off' } },
  { id: 'v2', label: 'Mon 14:40 · stronger walls', s: { layer_height: 0.2, infill: 20, wall_loops: 3, nozzle_temp: 210, support: 'off' } },
  { id: 'v3', label: 'Tue 09:05 · finer + supports', s: { layer_height: 0.12, infill: 20, wall_loops: 3, nozzle_temp: 215, support: 'tree' } },
];

function mark(a: unknown, b: unknown) {
  if (a === b) return null;
  if (typeof a === 'number' && typeof b === 'number') return b > a ? ['▲', 'text-emerald-500'] : ['▼', 'text-rose-500'];
  return ['●', 'text-amber-500'];
}

export default function VersionCompare() {
  const [sel, setSel] = useState([0, 2]); // last two clicked versions
  const older = Math.min(...sel), newer = Math.max(...sel);
  const a = versions[older].s as Record<string, unknown>;
  const b = versions[newer].s as Record<string, unknown>;
  const changed = Object.keys(b).filter((k) => a[k] !== b[k]);

  return (
    <div className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <ol className="sm:w-64 border-b sm:border-b-0 sm:border-r border-zinc-200 dark:border-zinc-800 p-3 space-y-1 text-sm">
          {versions.map((v, i) => (
            <li key={v.id}>
              <button
                onClick={() => setSel([sel[1], i])}
                className={`w-full text-left rounded-lg px-3 py-2 transition ${i === older || i === newer ? 'bg-accent/15 text-accent' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
              >
                {v.label}
              </button>
            </li>
          ))}
          <li className="px-3 pt-2 text-xs text-zinc-500">Click two versions to compare them.</li>
        </ol>
        <div className="flex-1 p-4 overflow-x-auto">
          {changed.length === 0 ? (
            <p className="text-sm text-zinc-500">Pick two different versions.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-zinc-500">
                <tr><th className="py-1">Setting</th><th>{versions[older].id}</th><th>{versions[newer].id}</th></tr>
              </thead>
              <tbody>
                {changed.map((k) => {
                  const [sym, cls] = mark(a[k], b[k])!;
                  return (
                    <tr key={k} className="border-t border-zinc-200 dark:border-zinc-800">
                      <td className="py-1.5 font-mono">{k}</td>
                      <td>{String(a[k])}</td>
                      <td>{String(b[k])} <span className={cls}>{sym}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
