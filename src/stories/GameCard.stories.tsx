import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import GameCard from "../components/GameCard";
import {
  GAME_ALPHA_T as GAME_ALPHA,
  GAME_BETA_T as GAME_BETA,
} from "../utils/test/data.mocks";

const meta = {
  title: "Components/GameCard",
  component: GameCard,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { game: GAME_ALPHA },
  tags: ["autodocs"],
} satisfies Meta<typeof GameCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alpha: Story = {};
export const Beta: Story = { args: { game: GAME_BETA } };
export const LongDescription: Story = {
  args: {
    game: { ...GAME_ALPHA, short_description: "Texto longo ".repeat(12) },
  },
};
