'use client';

import { useState, useRef, useCallback } from 'react';

export function useElevenLabsTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (isPlaying) {
      stop();
      return;
    }

    if (!text.trim()) return;

    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error('TTS failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };

      setIsLoading(false);
      setIsPlaying(true);
      await audio.play();
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('[Bokari TTS] Error:', err);
      }
      setIsLoading(false);
      setIsPlaying(false);
    }
  }, [isPlaying, stop]);

  return { speak, stop, isPlaying, isLoading };
}
