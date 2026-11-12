export type RepoInfo = {
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
  updated: string;
};

const cache = new Map<string, Promise<RepoInfo | null>>();

// Fetched at build time. Returns null on any failure so the build never breaks.
export function getRepo(repo: string): Promise<RepoInfo | null> {
  if (!cache.has(repo)) cache.set(repo, load(repo));
  return cache.get(repo)!;
}

async function load(repo: string): Promise<RepoInfo | null> {
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return null;
    const r = await res.json();
    return {
      url: r.html_url,
      stars: r.stargazers_count,
      language: r.language,
      topics: r.topics ?? [],
      updated: r.pushed_at,
    };
  } catch {
    return null;
  }
}
