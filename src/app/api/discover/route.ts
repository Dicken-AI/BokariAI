import { searchNews } from '@/lib/search';

const topicQueries = {
  africa: {
    queries: [
      'actualites Afrique aujourd\'hui',
      'Africa news today',
      'nouvelles Afrique derniere heure',
    ],
  },
  tech: {
    queries: [
      'technology Africa startups',
      'innovation technologique Afrique',
      'tech news Africa AI',
    ],
  },
  finance: {
    queries: [
      'economie Afrique actualites',
      'Africa economy finance news',
      'marche financier africain',
    ],
  },
  art: {
    queries: [
      'culture africaine actualites',
      'musique africaine nouveautes',
      'cinema art africain',
    ],
  },
  sports: {
    queries: [
      'football africain actualites',
      'sport Afrique CAN',
      'athletes africains',
    ],
  },
  politics: {
    queries: [
      'politique Afrique actualites',
      'elections Afrique',
      'geopolitique union africaine',
    ],
  },
};

type Topic = keyof typeof topicQueries;

export const GET = async (req: Request) => {
  try {
    const params = new URL(req.url).searchParams;

    const mode: 'normal' | 'preview' =
      (params.get('mode') as 'normal' | 'preview') || 'normal';
    const topic: Topic = (params.get('topic') as Topic) || 'africa';

    const selectedTopic = topicQueries[topic] || topicQueries.africa;

    let data: any[] = [];

    if (mode === 'normal') {
      const results = await Promise.all(
        selectedTopic.queries.map((query) => searchNews(query, 'fr')),
      );

      const seenUrls = new Set<string>();
      data = results
        .flat()
        .filter((item) => {
          const url = item.url?.toLowerCase().trim();
          if (!url || seenUrls.has(url)) return false;
          seenUrls.add(url);
          return true;
        })
        .sort(() => Math.random() - 0.5);
    } else {
      const randomQuery =
        selectedTopic.queries[
          Math.floor(Math.random() * selectedTopic.queries.length)
        ];
      data = await searchNews(randomQuery, 'fr');
    }

    return Response.json(
      { blogs: data },
      { status: 200 },
    );
  } catch (err) {
    console.error(`An error occurred in discover route: ${err}`);
    return Response.json(
      { message: 'An error has occurred' },
      { status: 500 },
    );
  }
};
