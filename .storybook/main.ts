import type { StorybookConfig } from "@storybook/react-vite";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },

  async viteFinal(base) {
    const { default: tailwindcss } = await import("@tailwindcss/vite");

    return {
      ...base,
      plugins: [...(base.plugins ?? []), tailwindcss()],
      server: {
        ...(base.server ?? {}),
        fs: {
          allow: [
            ...((base.server?.fs as any)?.allow ?? []),
            process.cwd(),
            path.resolve(process.cwd(), "src"),
          ],
        },
      },
    };
  },
};

export default config;
