import { motion } from 'motion/react';

const words = ['software', 'AI', 'hardware', 'tools'];

export default function Hero() {
  return (
    <section className="py-16">
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-accent font-medium">
        Hi, I'm
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-2 text-5xl sm:text-7xl font-bold tracking-tight"
      >
        Federico Ricchiuto
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400"
      >
        I build{' '}
        {words.map((w, i) => (
          <motion.span
            key={w}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15 }}
            className="inline-block font-medium text-zinc-900 dark:text-zinc-100"
          >
            {w}
            {i < words.length - 1 ? ', ' : '.'}
          </motion.span>
        ))}{' '}
        Here you'll find my personal projects, a few studies on data and AI, and my CV.
      </motion.p>
    </section>
  );
}
