import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Current mode:", mode);
  console.log("Environment variables:", env);
  return {
    plugins: [react(), tailwindcss()],
    base: "/data-charts",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
        "@/components": path.resolve(__dirname, "./src/components"),
      },
    },
    build: {
      outDir: "dist",
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: (id: any) => {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },
  };
});
