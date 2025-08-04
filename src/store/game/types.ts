export interface Game {
  min_ram?: string;
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_url: string;
  freetogame_profile_url: string;
  minimum_system_requirements?: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
}

export interface GameFilters {
  genres: string[];
  platform: string;
  ram: number;
}

export interface GameState {
  filters: GameFilters;
  games: Game[];
  loading: boolean;
  error: string | null;
}
