import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2025,
      sourceType: "module",
    },

    rules: {
      /* ⚙️ Boas práticas */
      "class-methods-use-this": "off",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "no-undef": "off",
      "no-empty": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-debugger": "error",
      "prefer-arrow-callback": "error",
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "no-duplicate-imports": "error",
      "spaced-comment": ["error", "always", { markers: ["/"] }],

      /* 🎨 Estilo consistente */
      indent: ["error", 2],
      semi: ["error", "always"],
      "comma-dangle": ["error", "only-multiline"], // 👈 apenas esta
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-in-parens": ["error", "never"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
    },
  },
];
