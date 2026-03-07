'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';

interface ThinkBoxProps {
  content: string;
  thinkingEnded: boolean;
}

const ThinkBox = ({ content, thinkingEnded }: ThinkBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (thinkingEnded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }, [thinkingEnded]);

  return (
    <div className="my-3 rounded-xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden bg-black/[0.01] dark:bg-white/[0.01]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition duration-200"
      >
        <div className="flex items-center gap-2">
          <Brain
            size={15}
            className={`${thinkingEnded ? 'text-black/40 dark:text-white/30' : 'text-violet-500 dark:text-violet-400 bokari-pulse'}`}
          />
          <span className="text-[13px] font-medium text-black/60 dark:text-white/50">
            {thinkingEnded ? 'Reflexion' : 'Reflexion en cours...'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={15} className="text-black/25 dark:text-white/20" />
        ) : (
          <ChevronDown size={15} className="text-black/25 dark:text-white/20" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 py-3 text-black/50 dark:text-white/40 text-[13px] leading-relaxed border-t border-black/[0.04] dark:border-white/[0.04] whitespace-pre-wrap max-h-[300px] overflow-y-auto">
          {content}
        </div>
      )}
    </div>
  );
};

export default ThinkBox;
