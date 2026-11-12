import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

type Image = { src: string; caption: string };

export default function Gallery({ images }: { images: Image[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="not-prose my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <button key={img.src} onClick={() => setOpen(i)} className="group text-left">
            <motion.img
              layoutId={img.src}
              src={img.src}
              alt={img.caption}
              loading="lazy"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:shadow-lg transition-shadow"
            />
            <span className="mt-2 block text-sm text-zinc-500">{img.caption}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-label={images[open].caption}
          >
            <motion.img layoutId={images[open].src} src={images[open].src} alt={images[open].caption} className="max-h-full max-w-full rounded-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
