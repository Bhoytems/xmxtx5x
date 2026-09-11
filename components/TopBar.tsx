"use client";

import { useState } from "react";

export default function TopBar({ title }: { title: string }) {
  const [paused, setPaused] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setPaused((p) => !p);
    setConfirming(false);
    // Wire this to an API route that flips engine_controls.global.is_paused
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-base-700 bg-base-900 px-6">
      <h1 className="text-sm font-medium text-ink-300">{title}</h1>
      <button
        onClick={handleClick}
        className={`rounded px-3 py-1.5 text-xs font-medium transition ${
          paused
            ? "bg-signal-tealDim text-signal-teal"
            : confirming
            ? "bg-signal-red text-white"
            : "bg-signal-redDim text-signal-red hover:bg-signal-red hover:text-white"
        }`}
      >
        {paused ? "Resume engine" : confirming ? "Confirm pause?" : "Pause all trading"}
      </button>
    </header>
  );
}
