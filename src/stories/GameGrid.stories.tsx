import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import GameGrid from "../components/GameGrid";
import { GAMES_GRID as games } from "../utils/test/data.mocks";

const meta = {
  title: "Components/GameGrid",
  component: GameGrid,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: { games },
  tags: ["autodocs"],
} satisfies Meta<typeof GameGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { games: [] } };
