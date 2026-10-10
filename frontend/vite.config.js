// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
//==========================================
import { defineConfig, transformWithOxc } from "vite";
import react from "@vitejs/plugin-react";

// Custom plugin to tell Oxc to parse JS as JSX
const transformJsxInJs = () => ({
  name: "transform-jsx-in-js",
  enforce: "pre",
  async transform(code, id) {
    // Target only .js files
    if (!id.match(/.*\.js$/)) {
      return null;
    }

    // Force the Oxc language parser to 'jsx'
    return await transformWithOxc(code, id, {
      lang: "jsx",
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    transformJsxInJs(), // Add it to your plugins array
  ],
});
