import type { Config } from "aleph/types.d.ts";

export default <Config> {
  build: {
    target: "es2020",
  },
  i18n: {
    defaultLocale: "ja",
    locales: ["en", "ja"],
  },
};
