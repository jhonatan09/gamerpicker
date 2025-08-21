import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import GameDetails from "../pages/GameDetails";
import {
  GAME_ALPHA_T as GAME_ALPHA,
  SPECS_ALPHA,
} from "../utils/test/data.mocks";
import type { JSX } from "react";

function Shell({
  children,
  specsStatus = 200,
}: {
  children: any;
  specsStatus?: 200 | 204;
}) {
  useEffect(() => {
    const originalAxiosGet = (axios as any).get;
    const originalEnv = { ...(import.meta as any).env };

    (import.meta as any).env = {
      ...originalEnv,
      VITE_SPECS_API: "http://storybook.mock",
    };

    let i = 0;
    (axios as any).get = async (_url: string, _cfg?: any) => {
      i++;
      if (i === 1) {
        return { data: [GAME_ALPHA] };
      }

      if (specsStatus === 204) {
        return { status: 204, data: undefined };
      }
      return { status: 200, data: SPECS_ALPHA };
    };

    return () => {
      (axios as any).get = originalAxiosGet;
      (import.meta as any).env = originalEnv;
    };
  }, [specsStatus]);

  return (
    <MemoryRouter initialEntries={["/games/1"]}>
      <Routes>
        <Route path="/games/:id" element={children as JSX.Element} />
      </Routes>
    </MemoryRouter>
  );
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

export const SemSpecs: Story = {
  name: "Sem specs (204)",
  decorators: [
    (Story) => (
      <Shell specsStatus={204}>
        <Story />
      </Shell>
    ),
  ],
};
