'use client';

import DeleteChat from '@/components/DeleteChat';
import { formatTimeDifference } from '@/lib/utils';
import { BookOpenText, ClockIcon, FileText, Globe2Icon, Loader2, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { authFetch } from '@/lib/supabase/fetch';

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  sources: string[];
  files: { fileId: string; name: string }[];
}

const Page = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);

      const res = await authFetch(`/api/chats`, {
        method: 'GET',
      });

      const data = await res.json();

      setChats(data.chats);
      setLoading(false);
    };

    fetchChats();
  }, []);

  return (
    <div className="pt-14 lg:pt-0">
      {/* Header */}
      <div className="pt-10 pb-6 border-b border-black/[0.05] dark:border-white/[0.05]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bokari-500/8 dark:bg-bokari-500/10 flex items-center justify-center">
              <BookOpenText size={20} className="text-bokari-500" />
            </div>
            <div>
              <h1
                className="text-3xl text-black/90 dark:text-white/90 tracking-tight"
                style={{ fontFamily: 'Instrument Serif, Georgia, serif' }}
              >
                Bibliotheque
              </h1>
              <p className="text-[13px] text-black/40 dark:text-white/30 mt-0.5">
                Vos conversations et recherches
              </p>
            </div>
          </div>

          {!loading && (
            <span className="inline-flex items-center gap-1.5 text-[12px] text-black/40 dark:text-white/30 bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1.5 rounded-full w-fit">
              <BookOpenText size={12} />
              {chats.length} {chats.length === 1 ? 'conversation' : 'conversations'}
            </span>
          )}
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
      ) : chats.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-14 h-14 rounded-2xl bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center mb-4">
            <Search className="text-black/25 dark:text-white/20" size={24} />
          </div>
          <p className="text-[15px] text-black/50 dark:text-white/40 mb-1">
            Aucune conversation
          </p>
          <p className="text-[13px] text-black/35 dark:text-white/25 mb-4">
            Commencez une recherche pour voir vos conversations ici
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-bokari-500 text-white text-[13px] font-medium hover:bg-bokari-600 transition-colors shadow-sm"
          >
            Nouvelle recherche
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="pt-5 pb-28 lg:pb-8">
          <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {chats.map((chat) => {
              const sourcesLabel =
                chat.sources.length === 0
                  ? null
                  : chat.sources.length <= 2
                    ? chat.sources
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(', ')
                    : `${chat.sources
                        .slice(0, 2)
                        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                        .join(', ')} +${chat.sources.length - 2}`;

              return (
                <div
                  key={chat.id}
                  className="group flex flex-col gap-2.5 px-5 py-4 hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/c/${chat.id}`}
                      className="flex-1 text-black/80 dark:text-white/80 text-[15px] font-medium leading-snug line-clamp-2 group-hover:text-bokari-600 dark:group-hover:text-bokari-400 transition-colors duration-200"
                      title={chat.title}
                    >
                      {chat.title}
                    </Link>
                    <div className="pt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <DeleteChat
                        chatId={chat.id}
                        chats={chats}
                        setChats={setChats}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-black/35 dark:text-white/30">
                      <ClockIcon size={11} />
                      {formatTimeDifference(new Date(), chat.createdAt)}
                    </span>

                    {sourcesLabel && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-black/35 dark:text-white/30 bg-black/[0.03] dark:bg-white/[0.03] rounded-full px-2 py-0.5">
                        <Globe2Icon size={10} />
                        {sourcesLabel}
                      </span>
                    )}
                    {chat.files.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-black/35 dark:text-white/30 bg-black/[0.03] dark:bg-white/[0.03] rounded-full px-2 py-0.5">
                        <FileText size={10} />
                        {chat.files.length} {chat.files.length === 1 ? 'fichier' : 'fichiers'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
