// src/components/GameGrid.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import GameGrid from "../components/GameGrid";

const meta: Meta<typeof GameGrid> = {
  title: "Components/GameGrid",
  component: GameGrid,
};

export default meta;

type Story = StoryObj<typeof GameGrid>;

export const Default: Story = {
  args: {
    games: [
      {
        id: 1,
        title: "Game 1",
        thumbnail: "https://www.freetogame.com/g/1/thumbnail.jpg",
        short_description: "First game description.",
        genre: "Shooter",
        platform: "PC (Windows)",
        min_ram: "4 GB",
        game_url: "",
        publisher: "",
        developer: "",
        release_date: "",
        freetogame_url: "",
        freetogame_profile_url: "",
      },
      {
        id: 2,
        title: "Game 2",
        thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg",
        short_description: "Second game description.",
        genre: "Strategy",
        platform: "Web Browser",
        min_ram: "4 GB",
        game_url: "",
        publisher: "",
        developer: "",
        release_date: "",
        freetogame_url: "",
        freetogame_profile_url: "",
      },
    ],
  },
};
