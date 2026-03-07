/* eslint-disable @next/next/no-img-element */
import { PlayCircle, PlusIcon, VideoIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import Lightbox, { GenericSlide, VideoSlide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Message } from './ChatWindow';

type Video = {
  url: string;
  img_src: string;
  title: string;
  iframe_src: string;
};

declare module 'yet-another-react-lightbox' {
  export interface VideoSlide extends GenericSlide {
    type: 'video-slide';
    src: string;
    iframe_src: string;
  }

  interface SlideTypes {
    'video-slide': VideoSlide;
  }
}

const Searchvideos = ({
  query,
  chatHistory,
  messageId,
}: {
  query: string;
  chatHistory: [string, string][];
  messageId: string;
}) => {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<VideoSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  return (
    <>
      {!loading && videos === null && (
        <button
          id={`search-videos-${messageId}`}
          onClick={async () => {
            setLoading(true);

            const chatModelProvider = localStorage.getItem(
              'chatModelProviderId',
            );
            const chatModel = localStorage.getItem('chatModelKey');

            const res = await fetch(`/api/videos`, {
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

            const videos = data.videos ?? [];
            setVideos(videos);
            setSlides(
              videos.map((video: Video) => {
                return {
                  type: 'video-slide',
                  iframe_src: video.iframe_src,
                  src: video.img_src,
                };
              }),
            );
            setLoading(false);
          }}
          className="border border-dashed border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] active:scale-[0.98] duration-200 transition px-4 py-2.5 flex items-center justify-between rounded-xl text-sm w-full"
        >
          <div className="flex items-center gap-2 text-black/50 dark:text-white/40">
            <VideoIcon size={16} />
            <span className="text-[13px]">Videos</span>
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
      {videos !== null && videos.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-1.5">
            {videos.length > 4
              ? videos.slice(0, 3).map((video, i) => (
                  <div
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    className="relative transition-all duration-200 hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
                    key={i}
                  >
                    <img
                      src={video.img_src}
                      alt={video.title}
                      className="h-full w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/50 backdrop-blur-sm text-white/80 px-1.5 py-0.5 flex items-center gap-1 rounded-md">
                      <PlayCircle size={11} />
                      <span className="text-[10px]">Video</span>
                    </div>
                  </div>
                ))
              : videos.map((video, i) => (
                  <div
                    onClick={() => {
                      setOpen(true);
                      setSlides([
                        slides[i],
                        ...slides.slice(0, i),
                        ...slides.slice(i + 1),
                      ]);
                    }}
                    className="relative transition-all duration-200 hover:opacity-90 cursor-pointer rounded-xl overflow-hidden"
                    key={i}
                  >
                    <img
                      src={video.img_src}
                      alt={video.title}
                      className="h-full w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/50 backdrop-blur-sm text-white/80 px-1.5 py-0.5 flex items-center gap-1 rounded-md">
                      <PlayCircle size={11} />
                      <span className="text-[10px]">Video</span>
                    </div>
                  </div>
                ))}
            {videos.length > 4 && (
              <button
                onClick={() => setOpen(true)}
                className="bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.05] dark:hover:bg-white/[0.05] transition-all duration-200 h-auto w-full rounded-xl flex flex-col justify-between p-2.5 gap-2"
              >
                <div className="flex items-center -space-x-1">
                  {videos.slice(3, 6).map((video, i) => (
                    <img
                      key={i}
                      src={video.img_src}
                      alt={video.title}
                      className="h-5 w-10 rounded-md aspect-video object-cover border-2 border-white dark:border-dark-200"
                    />
                  ))}
                </div>
                <span className="text-black/40 dark:text-white/35 text-[11px]">
                  +{videos.length - 3} videos
                </span>
              </button>
            )}
          </div>
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            index={currentIndex}
            on={{
              view: ({ index }) => {
                const previousIframe = videoRefs.current[currentIndex];
                if (previousIframe?.contentWindow) {
                  previousIframe.contentWindow.postMessage(
                    '{"event":"command","func":"pauseVideo","args":""}',
                    '*',
                  );
                }

                setCurrentIndex(index);
              },
            }}
            render={{
              slide: ({ slide }) => {
                const index = slides.findIndex((s) => s === slide);
                return slide.type === 'video-slide' ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <iframe
                      src={`${slide.iframe_src}${slide.iframe_src.includes('?') ? '&' : '?'}enablejsapi=1`}
                      ref={(el) => {
                        if (el) {
                          videoRefs.current[index] = el;
                        }
                      }}
                      className="aspect-video max-h-[95vh] w-[95vw] rounded-2xl md:w-[80vw]"
                      allowFullScreen
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : null;
              },
            }}
          />
        </>
      )}
    </>
  );
};

export default Searchvideos;
