import { Discover } from '@/app/discover/page';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const SmallNewsCard = ({ item }: { item: Discover }) => {
  const imgSrc = (() => {
    try {
      const u = new URL(item.thumbnail);
      return u.origin + u.pathname + `?id=${u.searchParams.get('id')}`;
    } catch {
      return item.thumbnail;
    }
  })();

  return (
    <Link
      href={`/?q=Summary: ${item.url}`}
      className="group rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] hover:border-black/[0.08] dark:hover:border-white/[0.08] hover:shadow-medium transition-all duration-300 flex flex-col"
      target="_blank"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black/[0.03] dark:bg-white/[0.03]">
        <img
          className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
          src={imgSrc}
          alt={item.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <ArrowUpRight size={12} className="text-black/70 dark:text-white/70" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-[13px] mb-1.5 leading-snug line-clamp-2 text-black/80 dark:text-white/80 group-hover:text-bokari-600 dark:group-hover:text-bokari-400 transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-black/40 dark:text-white/35 text-[12px] leading-relaxed line-clamp-2">
          {item.content}
        </p>
      </div>
    </Link>
  );
};

export default SmallNewsCard;
