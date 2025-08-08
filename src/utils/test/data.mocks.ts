import type { Game } from "../../store/game/types";

export type MinimumSystemRequirements = {
  os?: string;
  memory?: string;
  storage?: string;
  processor?: string;
  graphics?: string;
  additionalNotes?: string;
};

export type GameMock = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url?: string;
  genre: string;
  platform?: "PC (Windows)" | "Web Browser" | "PC" | "Web" | string;
  publisher?: string;
  developer?: string;
  release_date?: string;
  freetogame_url?: string;
  freetogame_profile_url?: string;
  minimum_system_requirements?: MinimumSystemRequirements;
};

const BASE_GAME: GameMock = {
  id: 0,
  title: "Base Game",
  thumbnail: "https://example.com/thumb.jpg",
  short_description: "Descrição curta.",
  game_url: "https://example.com/game",
  genre: "Shooter",
  platform: "PC (Windows)",
  publisher: "Publisher",
  developer: "Developer",
  release_date: "2020-01-01",
  freetogame_url: "https://freetogame.com",
  freetogame_profile_url: "https://freetogame.com/base",
  minimum_system_requirements: {
    os: "Windows 10",
    memory: "8 GB",
    storage: "20 GB",
    processor: "Intel i5",
    graphics: "GTX 960",
    additionalNotes: "12+",
  },
};

export function makeGame(overrides: Partial<GameMock> = {}): GameMock {
  return {
    ...BASE_GAME,
    id: overrides.id ?? Math.floor(Math.random() * 100000),
    title: overrides.title ?? BASE_GAME.title,
    thumbnail: overrides.thumbnail ?? BASE_GAME.thumbnail,
    short_description:
      overrides.short_description ?? BASE_GAME.short_description,
    game_url: overrides.game_url ?? BASE_GAME.game_url,
    genre: overrides.genre ?? BASE_GAME.genre,
    platform: overrides.platform ?? BASE_GAME.platform,
    publisher: overrides.publisher ?? BASE_GAME.publisher,
    developer: overrides.developer ?? BASE_GAME.developer,
    release_date: overrides.release_date ?? BASE_GAME.release_date,
    freetogame_url: overrides.freetogame_url ?? BASE_GAME.freetogame_url,
    freetogame_profile_url:
      overrides.freetogame_profile_url ?? BASE_GAME.freetogame_profile_url,
    minimum_system_requirements: {
      ...BASE_GAME.minimum_system_requirements!,
      ...overrides.minimum_system_requirements,
    },
  };
}

export function makeGames(
  count: number,
  base: Partial<GameMock> = {}
): GameMock[] {
  return Array.from({ length: count }, (_, i) =>
    makeGame({ id: i + 1, title: `Game ${i + 1}`, ...base })
  );
}

export const GAMES_MINIMAL: GameMock[] = [
  {
    id: 1,
    title: "Alpha",
    thumbnail: "https://example.com/a.jpg",
    short_description: "Desc A",
    genre: "Shooter",
  },
  {
    id: 2,
    title: "Beta",
    thumbnail: "https://example.com/b.jpg",
    short_description: "Desc B",
    genre: "RPG",
  },
  {
    id: 3,
    title: "Gamma",
    thumbnail: "https://example.com/c.jpg",
    short_description: "Desc C",
    genre: "Strategy",
  },
];

export const GAME_ALPHA: GameMock = makeGame({
  id: 1,
  title: "Alpha",
  thumbnail: "https://example.com/a.jpg",
  short_description: "Um FPS rápido.",
  genre: "Shooter",
  platform: "PC (Windows)",
  minimum_system_requirements: {
    os: "Windows 10",
    memory: "8 GB",
    storage: "20 GB",
    processor: "Intel i5",
    graphics: "GTX 960",
  },
});

export const GAME_BETA: GameMock = makeGame({
  id: 2,
  title: "Beta",
  thumbnail: "https://example.com/b.jpg",
  short_description: "RPG tático por turnos.",
  genre: "RPG",
  platform: "Web Browser",
  minimum_system_requirements: {
    os: "Qualquer",
    memory: "4 GB",
    storage: "2 GB",
    processor: "Dual Core",
    graphics: "Integrada",
  },
});

export const GAME_GAMMA: GameMock = makeGame({
  id: 3,
  title: "Gamma",
  thumbnail: "https://example.com/c.jpg",
  short_description: "Estrategia em tempo real.",
  genre: "Strategy",
  platform: "PC (Windows)",
  minimum_system_requirements: {
    os: "Windows 10",
    memory: "16 GB",
    storage: "40 GB",
    processor: "Intel i7",
    graphics: "RTX 2060",
  },
});

export const GAMES: GameMock[] = [GAME_ALPHA, GAME_BETA, GAME_GAMMA];

export const SPECS_ALPHA: MinimumSystemRequirements = {
  os: "Windows 10",
  memory: "8 GB",
  storage: "20 GB",
  processor: "Intel i5",
  graphics: "GTX 960",
  additionalNotes: "12+",
};

export const GAMES_PC_ONLY = GAMES.filter((g) =>
  (g.platform || "").includes("PC")
);
export const GAMES_WEB_ONLY = GAMES.filter((g) =>
  (g.platform || "").includes("Web")
);
export const GAMES_WITH_MIN_RAM = (minGb: number) =>
  GAMES.filter((g) => {
    const mem = g.minimum_system_requirements?.memory || "0 GB";
    const n = parseInt(mem);
    return Number.isFinite(n) && n >= minGb;
  });

export const toGame = (g: GameMock): Game => ({
  id: g.id,
  title: g.title,
  thumbnail: g.thumbnail,
  short_description: g.short_description,
  genre: g.genre,
  game_url: g.game_url ?? "#",
  platform: g.platform ?? "PC (Windows)",
  publisher: g.publisher ?? "",
  developer: g.developer ?? "",
  release_date: g.release_date ?? "1970-01-01",
  freetogame_url: g.freetogame_url ?? "",
  freetogame_profile_url: g.freetogame_profile_url ?? "",
  minimum_system_requirements: {
    os: g.minimum_system_requirements?.os ?? "",
    memory: g.minimum_system_requirements?.memory ?? "0 GB",
    storage: g.minimum_system_requirements?.storage ?? "",
    processor: g.minimum_system_requirements?.processor ?? "",
    graphics: g.minimum_system_requirements?.graphics ?? "",
  },
});

export const GAME_ALPHA_T: Game = toGame(GAME_ALPHA);
export const GAME_BETA_T: Game = toGame(GAME_BETA);
export const GAME_GAMMA_T: Game = toGame(GAME_GAMMA);

export const GAMES_FULL: Game[] = [GAME_ALPHA_T, GAME_BETA_T, GAME_GAMMA_T];
export const GAMES_GRID: Game[] = GAMES_MINIMAL.map(toGame);

export const GAMES_PC_ONLY_T: Game[] = GAMES_FULL.filter((g) =>
  (g.platform || "").includes("PC")
);
export const GAMES_WEB_ONLY_T: Game[] = GAMES_FULL.filter((g) =>
  (g.platform || "").includes("Web")
);
