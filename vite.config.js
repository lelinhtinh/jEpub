import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import banner from 'vite-plugin-banner';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PACKAGE = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);
const bannerText = `${PACKAGE.name} - ${PACKAGE.version} | (c) 2018 ${PACKAGE.author} | ${PACKAGE.license} | ${PACKAGE.homepage}`;

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/jepub.js'),
            name: 'jEpub',
            formats: ['umd', 'es'],
            fileName: (format) =>
                format === 'umd' ? 'jepub.js' : `jepub.${format}.js`,
        },

        rollupOptions: {
            external: ['jszip', 'ejs'], // Externalize dependencies
            output: {
                globals: {
                    jszip: 'JSZip',
                    ejs: 'ejs',
                },
            },
            onwarn(warning, warn) {
                // Suppress Node.js module warnings for browser build
                if (
                    warning.code === 'MISSING_NODE_BUILTINS' ||
                    warning.code === 'UNRESOLVED_IMPORT'
                ) {
                    return;
                }
                // Suppress eval warnings from file-type package (dependency of image-type)
                if (
                    warning.message &&
                    warning.message.includes('Use of eval')
                ) {
                    return;
                }
                warn(warning);
            },
        },

        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
    },

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },

    plugins: [
        banner(bannerText),
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

    define: {
        global: 'globalThis', // For EJS compatibility
    },

    optimizeDeps: {
        include: ['ejs', 'jszip', '@xmldom/xmldom'],
    },
});
