import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";

import Home from "../pages/Home";
import { store } from "../store";
import { GAMES_FULL as GAMES } from "../utils/test/data.mocks";
import type { JSX } from "react";

function WithAxiosMock({ children }: any) {
  const original = (axios as any).get;
  (axios as any).get = async () => ({ data: GAMES });
  return (
    <>
      {children}
      <Restore onCleanup={() => ((axios as any).get = original)} />
    </>
  );
}

function Restore({ onCleanup }: { onCleanup: () => void }) {
  return null as unknown as JSX.Element;
}

const meta = {
  title: "Pages/Home",
  component: Home,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Provider store={store}>
          <WithAxiosMock>
            <Story />
          </WithAxiosMock>
        </Provider>
      </MemoryRouter>
    ),
  ],
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
