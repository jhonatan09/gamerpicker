import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import GameDetails from "../pages/GameDetails";
import {
  GAME_ALPHA_T as GAME_ALPHA,
  SPECS_ALPHA,
} from "../utils/test/data.mocks";
import type { JSX } from "react";

function Shell({ children }: any) {
  const original = (axios as any).get;
  let i = 0;
  (axios as any).get = async () => {
    i++;
    if (i === 1) return { data: [GAME_ALPHA] };
    return { data: SPECS_ALPHA };
  };

  return (
    <MemoryRouter initialEntries={["/games/1"]}>
      <Routes>
        <Route path="/games/:id" element={children} />
      </Routes>
      <Restore onCleanup={() => ((axios as any).get = original)} />
    </MemoryRouter>
  );
}

function Restore({ onCleanup }: { onCleanup: () => void }) {
  return null as unknown as JSX.Element;
}

const meta = {
  title: "Pages/GameDetails",
  component: GameDetails,
  decorators: [
    (Story) => (
      <Shell>
        <Story />
      </Shell>
    ),
  ],
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof GameDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const DarkMode: Story = {
  decorators: [
    (Story) => {
      const cls = document.documentElement.classList;
      if (!cls.contains("dark")) cls.add("dark");
      return (
        <Shell>
          <Story />
        </Shell>
      );
    },
  ],
};
