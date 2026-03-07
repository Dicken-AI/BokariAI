'use client';

import { useState, useRef, useCallback } from 'react';

export function useElevenLabsSTT() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error('[Bokari STT] Microphone access denied:', err);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve('');
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setIsTranscribing(true);

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];

        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());

        try {
          const formData = new FormData();
          formData.append('audio', blob, 'audio.webm');

          const res = await fetch('/api/stt', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) throw new Error('STT failed');

          const data = await res.json();
          setIsTranscribing(false);
          resolve(data.text || '');
        } catch (err) {
          console.error('[Bokari STT] Transcription error:', err);
          setIsTranscribing(false);
          resolve('');
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return { isRecording, isTranscribing, startRecording, stopRecording };
}
