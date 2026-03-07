import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import { File, LoaderCircle, Paperclip, Plus, Trash } from 'lucide-react';
import { useRef, useState } from 'react';
import { useChat } from '@/lib/hooks/useChat';
import { AnimatePresence } from 'motion/react';
import { motion } from 'framer-motion';

const AttachSmall = () => {
  const { files, setFiles, setFileIds, fileIds } = useChat();

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<any>();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const data = new FormData();

    for (let i = 0; i < e.target.files!.length; i++) {
      data.append('files', e.target.files![i]);
    }

    const embeddingModelProvider = localStorage.getItem(
      'embeddingModelProviderId',
    );
    const embeddingModel = localStorage.getItem('embeddingModelKey');

    data.append('embedding_model_provider_id', embeddingModelProvider!);
    data.append('embedding_model_key', embeddingModel!);

    const res = await fetch(`/api/uploads`, {
      method: 'POST',
      body: data,
    });

    const resData = await res.json();

    setFiles([...files, ...resData.files]);
    setFileIds([...fileIds, ...resData.files.map((file: any) => file.fileId)]);
    setLoading(false);
  };

  return loading ? (
    <div className="p-1.5">
      <LoaderCircle size={16} className="text-bokari-500 animate-spin" />
    </div>
  ) : files.length > 0 ? (
    <Popover className="max-w-[15rem] md:max-w-md lg:max-w-lg">
      {({ open }) => (
        <>
          <PopoverButton
            type="button"
            className="p-1.5 text-bokari-500 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] active:scale-[0.97] transition-all duration-200 focus:outline-none"
          >
            <File size={16} />
          </PopoverButton>
          <AnimatePresence>
            {open && (
              <PopoverPanel
                className="absolute z-10 w-64 md:w-[300px] bottom-14 left-0"
                static
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="origin-bottom-left bg-white dark:bg-dark-200 border border-black/[0.08] dark:border-white/[0.08] rounded-xl w-full max-h-[220px] md:max-h-none overflow-y-auto shadow-elevated"
                >
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-[13px] font-medium text-black/70 dark:text-white/60">
                      Fichiers ({files.length})
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-1 text-bokari-500 text-[12px] font-medium"
                      >
                        <input
                          type="file"
                          onChange={handleChange}
                          ref={fileInputRef}
                          accept=".pdf,.docx,.txt"
                          multiple
                          hidden
                        />
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() => {
                          setFiles([]);
                          setFileIds([]);
                        }}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="h-px bg-black/[0.05] dark:bg-white/[0.05]" />
                  <div className="p-2">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 p-2 rounded-lg"
                      >
                        <div className="w-7 h-7 rounded-lg bg-bokari-500/[0.06] flex items-center justify-center flex-shrink-0">
                          <File size={12} className="text-bokari-500" />
                        </div>
                        <span className="text-[12px] text-black/60 dark:text-white/50 truncate">
                          {file.fileName.length > 25
                            ? file.fileName
                                .replace(/\.\w+$/, '')
                                .substring(0, 25) +
                              '...' +
                              file.fileExtension
                            : file.fileName}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </PopoverPanel>
            )}
          </AnimatePresence>
        </>
      )}
    </Popover>
  ) : (
    <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="p-1.5 text-black/30 dark:text-white/25 rounded-lg hover:text-black/50 dark:hover:text-white/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-all duration-200"
    >
      <input
        type="file"
        onChange={handleChange}
        ref={fileInputRef}
        accept=".pdf,.docx,.txt"
        multiple
        hidden
      />
      <Paperclip size={16} />
    </button>
  );
};

export default AttachSmall;
