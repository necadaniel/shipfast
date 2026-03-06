import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextCoreWebVitals,
  {
    rules: {
      "no-unused-vars": "warn",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
