import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default preview;
