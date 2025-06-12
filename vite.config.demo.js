import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: 'demo',

    plugins: [
        nodePolyfills({
            include: [], // Minimal polyfills
            globals: {
                Buffer: false,
                global: false,
                process: false,
            },
            protocolImports: true,
        }),
    ],

    server: {
        port: 3333,
        open: true,
    },

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },

    define: {
        global: 'globalThis', // For EJS compatibility
    },
    optimizeDeps: {
        include: ['ejs', 'jszip', 'image-type', 'jsdom'],
    },

    // No build needed - demo uses source files directly
});
