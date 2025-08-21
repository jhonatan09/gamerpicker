import { FaGamepad } from "react-icons/fa";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 shadow-md py-3 px-6 flex items-center justify-between">
      <h1 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-zinc-900 dark:text-white">
        <FaGamepad className="h-9 w-9 text-purple-600" aria-hidden />
        <span>Gamer Picker</span>
      </h1>
    </header>
  );
}
