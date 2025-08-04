import { Link } from "react-router-dom";
import type { Game } from "../store/game/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.id}`}>
      <div className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition transform cursor-pointer">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-white">{game.title}</h3>
          <p className="text-sm text-purple-400">{game.genre}</p>
          <p className="text-sm text-gray-300">
            RAM Mínima:{" "}
            {game.min_ram && !isNaN(parseInt(game.min_ram))
              ? `${parseInt(game.min_ram)} GB`
              : "N/A"}
          </p>
          <p className="text-gray-300 text-sm mt-2 line-clamp-2">
            {game.short_description}
          </p>
          <span className="inline-block mt-3 text-sm text-blue-400 hover:underline">
            Ver detalhes
          </span>
        </div>
      </div>
    </Link>
  );
}
