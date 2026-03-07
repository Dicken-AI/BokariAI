'use client';

import { useEffect, useState } from 'react';
import { UIConfigSections } from '@/lib/config/types';
import { AnimatePresence, motion } from 'framer-motion';
import SetupConfig from './SetupConfig';

const SetupWizard = ({
  configSections,
}: {
  configSections: UIConfigSections;
}) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [setupState, setSetupState] = useState(1);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    (async () => {
      await delay(2500);
      setShowWelcome(false);
      await delay(600);
      setShowSetup(true);
      setSetupState(1);
      await delay(1500);
      setSetupState(2);
    })();
  }, []);

  return (
    <div className="bg-light-primary dark:bg-dark-primary h-screen w-screen fixed inset-0 overflow-hidden bokari-pattern">
      <AnimatePresence>
        {showWelcome && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              className="absolute flex flex-col items-center justify-center h-full"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Bokari sun logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="mb-6"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-bokari-500 to-bokari-700 flex items-center justify-center shadow-2xl shadow-bokari-500/30">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M6.34 17.66l-1.41 1.41" />
                    <path d="M19.07 4.93l-1.41 1.41" />
                  </svg>
                </div>
              </motion.div>

              <motion.h2
                transition={{ duration: 0.6 }}
                initial={{ opacity: 0, translateY: '30px' }}
                animate={{ opacity: 1, translateY: '0px' }}
                className="text-4xl md:text-6xl xl:text-8xl font-normal tracking-tight"
                style={{ fontFamily: 'PP Editorial, serif' }}
              >
                Bienvenue sur{' '}
                <span className="text-bokari-500 italic">
                  Bokari
                </span>
              </motion.h2>
              <motion.p
                transition={{ delay: 0.8, duration: 0.7 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-black/70 dark:text-white/70 text-sm md:text-lg xl:text-2xl mt-3"
              >
                <span className="font-light">L'information africaine,</span>{' '}
                <span className="font-light italic" style={{ fontFamily: 'PP Editorial, serif' }}>
                  verifiee par l'IA
                </span>
              </motion.p>

              {/* Kente accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="bokari-kente-accent w-32 rounded-full mt-4"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 0.2,
                scale: 1,
                transition: { delay: 0.8, duration: 0.7 },
              }}
              exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.6 } }}
              className="bg-bokari-500 left-50 translate-x-[-50%] h-[300px] w-[300px] rounded-full relative z-40 blur-[100px]"
            />
          </div>
        )}
        {showSetup && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {setupState === 1 && (
                <motion.p
                  key="setup-text"
                  transition={{ duration: 0.6 }}
                  initial={{ opacity: 0, translateY: '30px' }}
                  animate={{ opacity: 1, translateY: '0px' }}
                  exit={{
                    opacity: 0,
                    translateY: '-30px',
                    transition: { duration: 0.6 },
                  }}
                  className="text-2xl md:text-4xl xl:text-6xl font-normal tracking-tight"
                  style={{ fontFamily: 'PP Editorial, serif' }}
                >
                  Configurons{' '}
                  <span className="text-bokari-500 italic">
                    Bokari
                  </span>{' '}
                  pour vous
                </motion.p>
              )}
              {setupState > 1 && (
                <motion.div
                  key="setup-config"
                  initial={{ opacity: 0, translateY: '30px' }}
                  animate={{
                    opacity: 1,
                    translateY: '0px',
                    transition: { duration: 0.6 },
                  }}
                >
                  <SetupConfig
                    configSections={configSections}
                    setupState={setupState}
                    setSetupState={setSetupState}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SetupWizard;
