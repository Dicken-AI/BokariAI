import { getSearxngURL } from './config/serverRegistry';

interface SearxngSearchOptions {
  categories?: string[];
  engines?: string[];
  language?: string;
  pageno?: number;
}

interface SearxngSearchResult {
  title: string;
  url: string;
  img_src?: string;
  thumbnail_src?: string;
  thumbnail?: string;
  content?: string;
  author?: string;
  iframe_src?: string;
}

// Public SearxNG instances as fallback when local instance is unavailable
const PUBLIC_SEARXNG_INSTANCES = [
  'https://searx.be',
  'https://search.sapti.me',
  'https://searx.tiekoetter.com',
  'https://search.bus-hit.me',
  'https://searx.work',
  'https://paulgo.io',
];

const tryFetchSearxng = async (
  baseURL: string,
  query: string,
  opts?: SearxngSearchOptions,
  timeoutMs = 8000,
): Promise<{ results: SearxngSearchResult[]; suggestions: string[] } | null> => {
  try {
    const url = new URL(`${baseURL}/search?format=json`);
    url.searchParams.append('q', query);

    if (opts) {
      Object.keys(opts).forEach((key) => {
        const value = opts[key as keyof SearxngSearchOptions];
        if (Array.isArray(value)) {
          url.searchParams.append(key, value.join(','));
          return;
        }
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Bokari/1.0 (AI Journalist Platform)',
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    const results: SearxngSearchResult[] = data.results || [];
    const suggestions: string[] = data.suggestions || [];

    return { results, suggestions };
  } catch {
    return null;
  }
};

// Track which instance worked last to avoid retrying failed ones
let lastWorkingInstance: string | null = null;

export const searchSearxng = async (
  query: string,
  opts?: SearxngSearchOptions,
) => {
  // 1. Try configured local SearxNG first
  const configuredURL = getSearxngURL();
  if (configuredURL) {
    const result = await tryFetchSearxng(configuredURL, query, opts, 5000);
    if (result && result.results.length > 0) {
      return result;
    }
  }

  // 2. Try last working public instance
  if (lastWorkingInstance) {
    const result = await tryFetchSearxng(lastWorkingInstance, query, opts);
    if (result && result.results.length > 0) {
      return result;
    }
    lastWorkingInstance = null;
  }

  // 3. Try public instances in parallel (race for first success)
  const shuffled = [...PUBLIC_SEARXNG_INSTANCES].sort(() => Math.random() - 0.5);

  // Try in batches of 3 for speed
  for (let i = 0; i < shuffled.length; i += 3) {
    const batch = shuffled.slice(i, i + 3);
    const results = await Promise.all(
      batch.map((url) => tryFetchSearxng(url, query, opts).then((r) => ({ url, result: r }))),
    );

    for (const { url, result } of results) {
      if (result && result.results.length > 0) {
        lastWorkingInstance = url;
        console.log(`[Bokari Search] Using public SearxNG instance: ${url}`);
        return result;
      }
    }
  }

  // 4. If all SearxNG instances fail, return empty results
  console.warn('[Bokari Search] All SearxNG instances failed for query:', query);
  return { results: [], suggestions: [] };
};
