'use client';

import { Compass, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import SmallNewsCard from '@/components/Discover/SmallNewsCard';
import MajorNewsCard from '@/components/Discover/MajorNewsCard';

export interface Discover {
  title: string;
  content: string;
  url: string;
  thumbnail: string;
}

const topics: { key: string; display: string }[] = [
  { display: 'Afrique', key: 'africa' },
  { display: 'Tech & Science', key: 'tech' },
  { display: 'Economie', key: 'finance' },
  { display: 'Culture & Societe', key: 'art' },
  { display: 'Sports', key: 'sports' },
  { display: 'Politique', key: 'politics' },
];

const Page = () => {
  const [discover, setDiscover] = useState<Discover[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState<string>(topics[0].key);

  const fetchArticles = async (topic: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discover?topic=${topic}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      data.blogs = data.blogs.filter((blog: Discover) => blog.thumbnail);
      setDiscover(data.blogs);
    } catch (err: any) {
      console.error('Error fetching data:', err.message);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(activeTopic);
  }, [activeTopic]);

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="pt-10 pb-6 border-b border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bokari-500/8 dark:bg-bokari-500/10 flex items-center justify-center">
              <Compass size={20} className="text-bokari-500" />
            </div>
            <div>
              <h1
                className="text-3xl text-black/90 dark:text-white/90 tracking-tight"
                style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
              >
                Decouvrir
              </h1>
              <p className="text-[13px] text-black/40 dark:text-white/30 mt-0.5">
                L'actualite analysee par Bokari
              </p>
            </div>
          </div>

          {/* Topic pills */}
          <div className="flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <button
                key={i}
                className={cn(
                  'rounded-full text-[13px] px-4 py-1.5 transition-all duration-200 font-medium',
                  activeTopic === t.key
                    ? 'bg-bokari-500 text-white shadow-sm shadow-bokari-500/20'
                    : 'bg-black/[0.04] dark:bg-white/[0.04] text-black/55 dark:text-white/45 hover:bg-black/[0.07] dark:hover:bg-white/[0.07] hover:text-black/75 dark:hover:text-white/65',
                )}
                onClick={() => setActiveTopic(t.key)}
              >
                {t.display}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-bokari-500 animate-spin" />
            <span className="text-[13px] text-black/30 dark:text-white/25">Chargement...</span>
          </div>
        </div>
      ) : !discover || discover.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-12 h-12 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center mb-3">
            <Compass className="text-black/30 dark:text-white/25" size={24} />
          </div>
          <p className="text-sm text-black/40 dark:text-white/35">
            Aucun article disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pb-28 pt-5 lg:pb-8 w-full">
          {/* Mobile: simple grid */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discover.map((item, i) => (
                <SmallNewsCard key={`mobile-${i}`} item={item} />
              ))}
            </div>
          </div>

          {/* Desktop: mixed layout */}
          <div className="hidden lg:block space-y-2">
            {discover &&
              discover.length > 0 &&
              (() => {
                const sections = [];
                let index = 0;

                while (index < discover.length) {
                  // Major card
                  if (index < discover.length) {
                    sections.push(
                      <MajorNewsCard
                        key={`major-${index}`}
                        item={discover[index]}
                        isLeft={sections.length % 2 === 0}
                      />,
                    );
                    index++;
                  }

                  if (index < discover.length) {
                    sections.push(
                      <div key={`divider-${index}`} className="h-px w-full bg-black/[0.04] dark:bg-white/[0.04]" />,
                    );
                  }

                  // 3 small cards
                  if (index < discover.length) {
                    const smallCards = discover.slice(index, index + 3);
                    sections.push(
                      <div
                        key={`small-group-${index}`}
                        className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 py-2"
                      >
                        {smallCards.map((item, i) => (
                          <SmallNewsCard
                            key={`small-${index + i}`}
                            item={item}
                          />
                        ))}
                      </div>,
                    );
                    index += 3;
                  }

                  if (index < discover.length) {
                    sections.push(
                      <div key={`divider2-${index}`} className="h-px w-full bg-black/[0.04] dark:bg-white/[0.04]" />,
                    );
                  }
                }

                return sections;
              })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
