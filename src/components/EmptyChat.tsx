'use client';

import { useEffect, useState } from 'react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useChat } from '@/lib/hooks/useChat';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Newspaper,
  TrendingUp,
  ShieldCheck,
  Globe2,
  Sparkles,
  Zap,
  BookOpen,
  BarChart3,
} from 'lucide-react';

const SUGGESTIONS = [
  {
    icon: Newspaper,
    title: 'Actualites Afrique',
    text: "Resume des actualites africaines de la semaine",
    color: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/5 dark:to-orange-500/5',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    icon: TrendingUp,
    title: 'Economie',
    text: "Taux de change CFA aujourd'hui",
    color: 'from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: ShieldCheck,
    title: 'Fact-check',
    text: 'Verifier une information recente',
    color: 'from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    icon: Globe2,
    title: 'Monde',
    text: "Principales nouvelles internationales du jour",
    color: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/5 dark:to-purple-500/5',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
];

const TRENDING = [
  { icon: Zap, text: "Dernieres elections en Afrique de l'Ouest" },
  { icon: BarChart3, text: "Impact de l'IA sur l'economie africaine" },
  { icon: BookOpen, text: "Nouvelles reformes educatives au Senegal" },
  { icon: Sparkles, text: "Startups tech africaines a suivre en 2026" },
];

const EmptyChat = () => {
  const { sendMessage } = useChat();
  const { requireAuth } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 pb-[8vh] pt-14 lg:pt-0 relative">
      {/* Subtle background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bokari-orb w-[500px] h-[500px] bg-bokari-400/[0.04] dark:bg-bokari-400/[0.02] -top-[200px] -right-[100px]" />
        <div className="bokari-orb w-[400px] h-[400px] bg-sand-400/[0.05] dark:bg-sand-400/[0.02] -bottom-[150px] -left-[100px]" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="w-full max-w-[720px] flex flex-col items-center relative z-10">
        {/* Logo + greeting */}
        <div className={`flex flex-col items-center mb-10 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bokari-400 to-bokari-600 flex items-center justify-center mb-5 shadow-lg shadow-bokari-500/15">
            <span className="text-white text-2xl font-bold" style={{ fontFamily: 'Instrument Serif, serif' }}>B</span>
          </div>
          <h1
            className="text-4xl md:text-5xl text-black/90 dark:text-white/90 tracking-tight text-center leading-tight"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            Que voulez-vous savoir ?
          </h1>
          <p className="text-[15px] text-black/40 dark:text-white/35 mt-3 text-center">
            Recherche intelligente, verification et analyse de l'information
          </p>
        </div>

        {/* Search input */}
        <div className={`w-full ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          <EmptyChatMessageInput />
        </div>

        {/* Suggestion cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => { if (requireAuth()) sendMessage(s.text); }}
              className={`group flex flex-col items-start p-3.5 rounded-2xl bg-gradient-to-br ${s.color} border border-black/[0.04] dark:border-white/[0.04] hover:border-black/[0.08] dark:hover:border-white/[0.08] hover:shadow-soft transition-all duration-300 text-left`}
              style={{ animationDelay: `${0.15 + i * 0.05}s` }}
            >
              <s.icon
                size={18}
                className={`${s.iconColor} mb-2.5 transition-transform duration-300 group-hover:scale-110`}
              />
              <span className="text-[13px] font-medium text-black/75 dark:text-white/75 group-hover:text-black/90 dark:group-hover:text-white/90 transition-colors">
                {s.title}
              </span>
              <span className="text-[11px] text-black/35 dark:text-white/30 mt-1 leading-relaxed line-clamp-2">
                {s.text}
              </span>
            </button>
          ))}
        </div>

        {/* Trending section */}
        <div className="mt-8 w-full">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-bokari-500" />
            <span className="text-[11px] font-medium text-black/40 dark:text-white/30 uppercase tracking-wider">
              Tendances
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {TRENDING.map((t, i) => (
              <button
                key={i}
                onClick={() => { if (requireAuth()) sendMessage(t.text); }}
                className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <t.icon size={14} className="text-black/25 dark:text-white/20 group-hover:text-bokari-500 transition-colors flex-shrink-0" />
                <span className="text-[13px] text-black/50 dark:text-white/40 group-hover:text-black/70 dark:group-hover:text-white/60 transition-colors truncate">
                  {t.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 left-0 w-full flex justify-center text-center px-4">
        <span className="text-[11px] text-black/20 dark:text-white/15">
          Bokari peut produire des informations inexactes. Verifiez les faits importants.
        </span>
      </div>
    </div>
  );
};

export default EmptyChat;
