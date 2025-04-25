import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

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
      "@typescript-eslint/no-empty-object-type": "off",
      "react/no-unescaped-entities": "off",
      "prefer-const": "off"
    },
    ignores: [
      "app/components/FirebaseStatus.tsx",
      "app/components/Sidebar.tsx",
      "app/components/TimeFilter.tsx",
      "app/components/TransactionForm.tsx",
      "app/components/analytics/AnalyticsCharts.tsx",
      "app/components/ui/input.tsx",
      "app/dashboard/page.tsx",
      "app/lib/api/airtable.ts",
      "app/lib/firebase/analytics.ts",
      "app/lib/firebase/firestore.ts",
      "app/settings/firebase-settings.tsx",
      "app/settings/simple-page.tsx"
    ]
  }
];

export default eslintConfig;
