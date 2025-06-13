import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), tsconfigPaths()],
    envPrefix: "APP_",
    // server: {
    //   host: "0.0.0.0", // listen on all interfaces
    //   port: 5173,
    //   https: true, // set to true if using HTTPS locally
    // },
  };
});
