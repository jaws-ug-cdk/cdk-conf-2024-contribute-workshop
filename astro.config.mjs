import { defineConfig } from "astro/config";

import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "AWS CDK Contribute Workshop",
      // このサイトのデフォルト言語として日本語を設定します。
      locales: {
        // 日本語のドキュメントは`src/content/docs/ja/`に置きます。
        root: {
          label: "Japanese",
          lang: "ja",
        },
      },
    }),
  ],
});
