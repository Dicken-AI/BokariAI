import { cn } from '@/lib/utils';
import { ArrowUp, Mic, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import AttachSmall from './MessageInputActions/AttachSmall';
import { useChat } from '@/lib/hooks/useChat';
import { useElevenLabsSTT } from '@/lib/hooks/useElevenLabsSTT';

const MessageInput = () => {
  const { loading, sendMessage } = useChat();
  const { isRecording, isTranscribing, startRecording, stopRecording } = useElevenLabsSTT();

  const [message, setMessage] = useState('');
  const [textareaRows, setTextareaRows] = useState(1);
  const [mode, setMode] = useState<'multi' | 'single'>('single');

  useEffect(() => {
    if (textareaRows >= 2 && message && mode === 'single') {
      setMode('multi');
    } else if (!message && mode === 'multi') {
      setMode('single');
    }
  }, [textareaRows, mode, message]);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable');

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMicClick = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setMessage((prev) => (prev ? prev + ' ' + text : text));
        inputRef.current?.focus();
      }
    } else {
      await startRecording();
    }
  };

  const MicButton = ({ size = 15 }: { size?: number }) => (
    <button
      type="button"
      onClick={handleMicClick}
      className={cn(
        'p-1.5 rounded-lg transition-all duration-200',
        isRecording
          ? 'text-red-500 animate-pulse'
          : isTranscribing
            ? 'text-bokari-500'
            : 'text-black/30 dark:text-white/25 hover:text-black/50 dark:hover:text-white/40',
      )}
    >
      {isTranscribing ? (
        <Loader2 size={size} className="animate-spin" />
      ) : (
        <Mic size={size} />
      )}
    </button>
  );

  const SubmitButton = () => (
    <button
      disabled={message.trim().length === 0 || loading}
      className="bg-bokari-500 text-white disabled:text-black/40 dark:disabled:text-white/25 hover:bg-bokari-600 transition-all duration-200 disabled:bg-black/[0.06] dark:disabled:bg-white/[0.06] rounded-xl p-2 shadow-sm disabled:shadow-none"
    >
      <ArrowUp size={15} />
    </button>
  );

  return (
    <form
      onSubmit={(e) => {
        if (loading) return;
        e.preventDefault();
        sendMessage(message);
        setMessage('');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
          e.preventDefault();
          sendMessage(message);
          setMessage('');
        }
      }}
      className={cn(
        'relative bg-white dark:bg-dark-200 p-3 flex items-center overflow-visible border transition-all duration-200',
        'border-black/[0.08] dark:border-white/[0.08] shadow-medium',
        'focus-within:border-bokari-500/25 dark:focus-within:border-bokari-500/20 focus-within:shadow-elevated',
        mode === 'multi' ? 'flex-col rounded-2xl' : 'flex-row rounded-full',
      )}
    >
      {mode === 'single' && <AttachSmall />}
      <TextareaAutosize
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onHeightChange={(height, props) => {
          setTextareaRows(Math.ceil(height / props.rowHeight));
        }}
        className="transition bg-transparent dark:placeholder:text-white/25 placeholder:text-black/30 placeholder:text-sm text-sm dark:text-white/90 text-black/90 resize-none focus:outline-none w-full px-2 max-h-24 lg:max-h-36 xl:max-h-48 flex-grow flex-shrink"
        placeholder="Posez une question de suivi..."
      />
      {mode === 'single' && (
        <div className="flex items-center gap-1">
          <MicButton />
          <SubmitButton />
        </div>
      )}
      {mode === 'multi' && (
        <div className="flex items-center justify-between w-full pt-2">
          <AttachSmall />
          <div className="flex items-center gap-1">
            <MicButton />
            <SubmitButton />
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;
