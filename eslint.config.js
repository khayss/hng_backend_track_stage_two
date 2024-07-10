import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": ["error", { ignorePatterns: ["req", "res", "next"] }],
      "no-undef": "error",
      "no-unused-imports": "error",
    },
  },
  pluginJs.configs.recommended,
];
