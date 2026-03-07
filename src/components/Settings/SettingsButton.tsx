import { Settings } from 'lucide-react';
import { useState } from 'react';
import SettingsDialogue from './SettingsDialogue';
import { AnimatePresence } from 'framer-motion';

const SettingsButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-black/45 dark:text-white/35 hover:text-black/70 dark:hover:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition-all duration-200"
        onClick={() => setIsOpen(true)}
      >
        <Settings size={18} strokeWidth={1.5} />
        <span className="text-[13px]">Parametres</span>
      </button>
      <AnimatePresence>
        {isOpen && <SettingsDialogue isOpen={isOpen} setIsOpen={setIsOpen} />}
      </AnimatePresence>
    </>
  );
};

export default SettingsButton;
