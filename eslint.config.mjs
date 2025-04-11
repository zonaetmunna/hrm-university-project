import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off",
      "unused-imports/no-unused-vars": "off"
    }
  },
  {
    ignores: [
      // Build artifacts
      ".next/**",
      "node_modules/**",
      
      // Specific problematic files
      "app/test-prisma/**/*.ts",
      "app/test-prisma/**/*.tsx",
      "app/api/**/*.ts",
      "app/api/**/*.tsx",
      "components/ui/chart.tsx",
      "app/dashboard/page.tsx"
    ]
  }
];

export default eslintConfig;
