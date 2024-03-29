/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["react", "@typescript-eslint", "unused-imports"],
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js"],
      parser: "@typescript-eslint/parser",
    },
  ],
  rules: {
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/ban-ts-comment": "off",
    "padding-line-between-statements": "off",
    "import/prefer-default-export": "off",
    "react/jsx-filename-extension": ["warn", { extensions: [".tsx"] }],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",

    "react/jsx-curly-brace-presence": [
      "warn",
      { props: "never", children: "never" },
    ],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/no-unused-vars": "off",
    "no-param-reassign": ["error"],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "no-nested-ternary": "warn",
  },
};

module.exports = config;
