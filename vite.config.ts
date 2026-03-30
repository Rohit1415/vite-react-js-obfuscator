import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import JavaScriptObfuscator from "javascript-obfuscator";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  const obfuscatorPlugin = (): Plugin => ({
    name: "vite-plugin-obfuscate-js",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      if (!isProd) return;

      for (const fileName in bundle) {
        const chunk: any = bundle[fileName];

        if (
          chunk.type === "chunk" &&
          fileName.endsWith(".js") &&
          !fileName.includes("vendor") &&
          !fileName.includes("react")
        ) {
          try {
            const obfuscated = JavaScriptObfuscator.obfuscate(chunk.code, {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.75,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              debugProtection: true,
              debugProtectionInterval: 10,
              disableConsoleOutput: true,
              identifierNamesGenerator: "hexadecimal",
              log: true,
              numbersToExpressions: true,
              renameGlobals: false,
              selfDefending: true,
              simplify: true,
              splitStrings: true,
              splitStringsChunkLength: 10,
              stringArray: true,
              stringArrayCallsTransform: true,
              stringArrayEncoding: ["base64"],
              stringArrayIndexShift: true,
              stringArrayRotate: true,
              stringArrayShuffle: true,
              stringArrayWrappersCount: 1,
              stringArrayWrappersChainedCalls: true,
              stringArrayWrappersParametersMaxCount: 2,
              stringArrayWrappersType: "variable",
              stringArrayThreshold: 0.75,
              unicodeEscapeSequence: false,
            });

            chunk.code = obfuscated.getObfuscatedCode();
          } catch (error) {
            console.error(
              `[Obfuscator Error] Failed to obfuscate ${fileName}:`,
              error,
            );
          }
        }
      }
    },
  });

  return {
    plugins: [react(), isProd ? obfuscatorPlugin() : null].filter(
      Boolean,
    ) as Plugin[],

    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: isProd,
          drop_debugger: isProd,
          passes: 2,
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
      },
      sourcemap: !isProd,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              if (
                id.includes("react") ||
                id.includes("react-dom") ||
                id.includes("react-router")
              ) {
                return "react-vendor";
              }
              return "vendor";
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      strictPort: true,
    },
    preview: {
      port: 3000,
      open: true,
      strictPort: true,
    },
  };
});
