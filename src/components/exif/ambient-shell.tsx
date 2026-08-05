"use client";

import { motion } from "framer-motion";

export function AmbientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0908]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgb(250 247 242 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(250 247 242 / 0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full bg-teal-400/8 blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(90vw,960px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      </div>
      {children}
    </div>
  );
}

export function Stagger({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
