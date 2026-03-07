import TurnDown from 'turndown';

const turndownService = new TurnDown({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// Remove script, style, nav, footer, header, aside elements
turndownService.remove(['script', 'style', 'nav', 'footer', 'header', 'aside', 'noscript', 'iframe']);

const MAX_CONTENT_LENGTH = 4000; // ~4k chars per page to keep context manageable

/**
 * Fetch a URL and extract its main text content as markdown
 */
export async function fetchAndExtract(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Bokari/1.0; +https://bokari.ai)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return null;
    }

    const html = await res.text();

    // Extract main content area if possible
    let contentHtml = html;

    // Try to find the main content area
    const mainMatch = html.match(/<(article|main)[^>]*>([\s\S]*?)<\/\1>/i);
    if (mainMatch) {
      contentHtml = mainMatch[2];
    } else {
      // Try to remove boilerplate
      contentHtml = contentHtml
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<aside[\s\S]*?<\/aside>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
    }

    const markdown = turndownService.turndown(contentHtml);

    // Clean up: remove excessive whitespace, empty lines
    const cleaned = markdown
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\s+$/gm, '')
      .trim();

    if (cleaned.length < 50) return null;

    // Truncate to manageable size
    return cleaned.slice(0, MAX_CONTENT_LENGTH);
  } catch {
    return null;
  }
}

/**
 * Fetch content from multiple URLs in parallel
 * Each URL has its own individual timeout - no global cutoff
 */
export async function fetchMultipleContent(
  urls: string[],
  maxUrls = 5,
  perUrlTimeout = 6000,
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const urlsToFetch = urls.slice(0, maxUrls);

  const promises = urlsToFetch.map(async (url) => {
    const content = await fetchAndExtract(url, perUrlTimeout);
    if (content) {
      results.set(url, content);
    }
  });

  await Promise.allSettled(promises);

  return results;
}
