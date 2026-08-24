import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "public/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // The base rule can't see TypeScript types; the TS-aware one replaces it.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // These fire on legitimate patterns in Radix-based components.
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    // Ambient declarations only contain types, which the rule can't see as "used".
    files: ["**/*.d.ts"],
    rules: { "@typescript-eslint/no-unused-vars": "off" },
  },
];

export default config;
