// Bokari router models — virtual models that map to the best OpenAI model
// Bokari 1: Premium quality (routes to gpt-4o for best quality/speed)
// BokariCheap: Budget friendly (routes to gpt-4o-mini for speed/cost)
export const BOKARI_MODEL_ROUTES: Record<string, string> = {
  'bokari-1': 'gpt-4o',
  'bokari-cheap': 'gpt-4o-mini',
};
