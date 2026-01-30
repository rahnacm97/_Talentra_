// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis", 
  },
  resolve: {
    alias: {
      // These aliases prevent runtime errors
      buffer: "buffer",
      events: "events",
      util: "util",
    },
  },
});
