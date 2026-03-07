import { Trash, Loader2 } from 'lucide-react';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { toast } from 'sonner';
import { authFetch } from '@/lib/supabase/fetch';
import { Chat } from '@/app/library/page';

const DeleteChat = ({
  chatId,
  chats,
  setChats,
  redirect = false,
}: {
  chatId: string;
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  redirect?: boolean;
}) => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      });

      if (res.status != 200) {
        throw new Error('Failed to delete chat');
      }

      const newChats = chats.filter((chat) => chat.id !== chatId);

      setChats(newChats);

      if (redirect) {
        window.location.href = '/';
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setConfirmationDialogOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmationDialogOpen(true)}
        className="p-2 rounded-xl text-black/25 dark:text-white/20 hover:text-red-500 hover:bg-red-500/[0.04] transition-all duration-200"
      >
        <Trash size={15} />
      </button>
      <Transition appear show={confirmationDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (!loading) {
              setConfirmationDialogOpen(false);
            }
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" />
          </TransitionChild>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-sm transform rounded-2xl bg-white dark:bg-dark-100 border border-black/[0.08] dark:border-white/[0.08] p-6 shadow-elevated transition-all">
                  <DialogTitle className="text-[16px] font-medium text-black/90 dark:text-white/90">
                    Supprimer la conversation ?
                  </DialogTitle>
                  <Description className="text-[14px] text-black/50 dark:text-white/40 mt-1.5">
                    Cette action est irreversible. La conversation sera definitivement supprimee.
                  </Description>
                  <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        if (!loading) setConfirmationDialogOpen(false);
                      }}
                      className="px-4 py-2 rounded-xl text-[13px] text-black/50 dark:text-white/40 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl text-[13px] font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        'Supprimer'
                      )}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteChat;
