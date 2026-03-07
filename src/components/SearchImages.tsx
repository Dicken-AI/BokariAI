/* eslint-disable @next/next/no-img-element */
import { ImagesIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';

type Image = {
  url: string;
  img_src: string;
  title: string;
};

const SearchImages = ({
  query,
  chatHistory,
  messageId,
}: {
  query: string;
  chatHistory: [string, string][];
  messageId: string;
}) => {
  const [images, setImages] = useState<Image[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  return (
    <>
      {!loading && images === null && (
        <button
          id={`search-images-${messageId}`}
          onClick={async () => {
            setLoading(true);

            const chatModelProvider = localStorage.getItem(
              'chatModelProviderId',
            );
            const chatModel = localStorage.getItem('chatModelKey');

            const res = await fetch(`/api/images`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: query,
                chatHistory: chatHistory,
                chatModel: {
                  providerId: chatModelProvider,
                  key: chatModel,
                },
              }),
            });

            const data = await res.json();

            const images = data.images ?? [];
            setImages(images);
            setSlides(
              images.map((image: Image) => {
                return {
                  src: image.img_src,
                };
              }),
            );
            setLoading(false);
          }}
          className="border border-dashed border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] active:scale-[0.98] duration-200 transition px-4 py-2.5 flex items-center justify-between rounded-xl text-sm w-full"
        >
          <div className="flex items-center gap-2 text-black/50 dark:text-white/40">
            <ImagesIcon size={16} />
            <span className="text-[13px]">Images</span>
          </div>
          <PlusIcon className="text-bokari-500" size={16} />
        </button>
      )}
      {loading && (
        <div className="grid grid-cols-2 gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 w-full rounded-xl bokari-shimmer aspect-video"
            />
          ))}
        </div>
      )}
      {images !== null && images.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-1.5">
            {images.length > 4
              ? images.slice(0, 3).map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-full w-full aspect-video object-cover rounded-xl transition-all duration-200 hover:opacity-90 cursor-zoom-in"
                  />
                ))
              : images.map((image, i) => (
                  <img
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    key={i}
                    src={image.img_src}
                    alt={image.title}
                    className="h-full w-full aspect-video object-cover rounded-xl transition-all duration-200 hover:opacity-90 cursor-zoom-in"
                  />
                ))}
            {images.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-200 h-auto w-full rounded-xl flex flex-col justify-between p-2.5 gap-2"
              >
                <div className="flex items-center -space-x-1">
                  {images.slice(3, 6).map((image, i) => (
                    <img
                      key={i}
                      src={image.img_src}
                      alt={image.title}
                      className="h-5 w-10 rounded-md aspect-video object-cover border-2 border-white dark:border-dark-200"
                    />
                  ))}
                </div>
                <span className="text-black/40 dark:text-white/35 text-[11px]">
                  +{images.length - 3} images
                </span>
              </button>
            )}
          </div>
          <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
        </>
      )}
    </>
  );
};

export default SearchImages;
