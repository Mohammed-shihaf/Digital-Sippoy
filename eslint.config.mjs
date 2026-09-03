import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      security: (await import("eslint-plugin-security")).default,
      sonarjs: (await import("eslint-plugin-sonarjs")).default,
    },
    rules: {
      // Cyclomatic complexity — warn only (data collection mode)
      "complexity": ["warn", 8],
      // Cognitive complexity via SonarJS
      "sonarjs/cognitive-complexity": ["warn", 15],
      // Security plugin rules
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      // No direct filesystem access outside lib/db.ts
      "no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["node:fs", "node:fs/promises", "fs", "fs/promises"],
              "message": "Filesystem access must go through lib/db.ts only."
            }
          ]
        }
      ]
    }
  }
];

export default eslintConfig;
