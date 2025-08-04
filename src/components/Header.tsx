import React from "react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 shadow-md py-3 px-6 flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
        🎮 Gamer Picker
      </h1>
    </header>
  );
}
