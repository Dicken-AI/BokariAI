'use client';

import { Cpu, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useEffect, useMemo, useState } from 'react';
import { MinimalProvider } from '@/lib/models/types';
import { useChat } from '@/lib/hooks/useChat';
import { AnimatePresence, motion } from 'motion/react';

const ModelSelector = () => {
  const [providers, setProviders] = useState<MinimalProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { setChatModelProvider, chatModelProvider } = useChat();

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/providers');
        if (!res.ok) throw new Error('Failed to fetch providers');
        const data: { providers: MinimalProvider[] } = await res.json();
        setProviders(data.providers);
      } catch (error) {
        console.error('Error loading providers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProviders();
  }, []);

  const allModels = useMemo(() => {
    return providers.flatMap((p) =>
      p.chatModels.map((m) => ({ ...m, providerId: p.id, providerName: p.name })),
    );
  }, [providers]);

  const handleModelSelect = (providerId: string, modelKey: string) => {
    setChatModelProvider({ providerId, key: modelKey });
    localStorage.setItem('chatModelProviderId', providerId);
    localStorage.setItem('chatModelKey', modelKey);
  };

  const currentModel = allModels.find(
    (m) => m.providerId === chatModelProvider?.providerId && m.key === chatModelProvider?.key,
  );

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <PopoverButton
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-light text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60 hover:bg-light-200/50 dark:hover:bg-white/5 transition-all duration-200 focus:outline-none"
          >
            <Cpu size={14} className="text-bokari-500" />
            <span className="hidden sm:inline">{currentModel?.name || 'Modele'}</span>
          </PopoverButton>
          <AnimatePresence>
            {open && (
              <PopoverPanel className="absolute z-10 w-[200px] right-0 bottom-full mb-2" static>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.1, ease: 'easeOut' }}
                  className="bg-light-primary dark:bg-dark-primary border border-light-200/60 dark:border-white/[0.08] rounded-xl shadow-lg overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-black/30 dark:text-white/30" size={20} />
                    </div>
                  ) : allModels.length === 0 ? (
                    <div className="text-center py-8 px-4 text-black/40 dark:text-white/40 text-xs">
                      Aucun modele configure
                    </div>
                  ) : (
                    <div className="p-1.5">
                      {allModels.map((model) => (
                        <button
                          key={model.key}
                          onClick={() => handleModelSelect(model.providerId, model.key)}
                          type="button"
                          className={cn(
                            'w-full px-3 py-2.5 flex items-center gap-2.5 text-left rounded-lg transition-all duration-200',
                            chatModelProvider?.key === model.key
                              ? 'bg-bokari-500/10 text-bokari-500'
                              : 'text-black/60 dark:text-white/60 hover:bg-light-200/40 dark:hover:bg-white/[0.04]',
                          )}
                        >
                          <Cpu
                            size={14}
                            className={cn(
                              chatModelProvider?.key === model.key
                                ? 'text-bokari-500'
                                : 'text-black/30 dark:text-white/30',
                            )}
                          />
                          <span className="text-xs font-light">{model.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  );
};

export default ModelSelector;
