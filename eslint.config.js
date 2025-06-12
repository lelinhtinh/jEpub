import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig, // Disable ESLint rules that conflict with Prettier
    {
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'module',
            globals: {
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                XMLHttpRequest: 'readonly',
                DOMParser: 'readonly',
                XMLSerializer: 'readonly',
                crypto: 'readonly',
                Blob: 'readonly',
                ArrayBuffer: 'readonly',
                Uint8Array: 'readonly',

                // Library globals (external dependencies)
                JSZip: 'readonly',
                ejs: 'readonly',
                jEpub: 'readonly',
            },
        },
        rules: {
            // Modern JavaScript
            'prefer-const': 'error',
            'no-var': 'error',

            // Code quality
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'error',
            'no-debugger': 'error',

            // ES6+
            'prefer-template': 'error',
            'template-curly-spacing': ['error', 'never'],
            'object-shorthand': 'error',

            // Remove formatting rules - handled by Prettier
            // 'indent': 'off',
            // 'quotes': 'off',
            // 'semi': 'off',
        },
    },
    {
        // Config for Node.js config files (Vite configs, ESLint config, etc.)
        files: ['*.config.js', '*.config.*.js'],
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'module',
            globals: {
                // Node.js globals
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',

                // Remove browser globals for config files
                // These should not be available in Node.js environment
                window: 'off',
                document: 'off',
                fetch: 'off',
                XMLHttpRequest: 'off',
                DOMParser: 'off',
                XMLSerializer: 'off',
                crypto: 'off',
                Blob: 'off',
            },
        },
        rules: {
            // Allow specific syntax in config files
            'object-shorthand': 'off',
            // Allow console in config files for debugging
            'no-console': 'off',
            // Config files often have unused parameters in functions
            'no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        // Config for sample/example files
        files: ['samples/**/*.js', 'demo/**/*.js'],
        languageOptions: {
            ecmaVersion: 2025,
            sourceType: 'module',
            globals: {
                // Node.js globals for sample files
                process: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',

                // Browser globals for demo files
                window: 'readonly',
                document: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                URL: 'readonly',
                URLSearchParams: 'readonly',
                XMLHttpRequest: 'readonly',
                DOMParser: 'readonly',
                XMLSerializer: 'readonly',
                crypto: 'readonly',
                Blob: 'readonly',
                ArrayBuffer: 'readonly',
                Uint8Array: 'readonly',

                // Library globals
                JSZip: 'readonly',
                ejs: 'readonly',
                jEpub: 'readonly',
            },
        },
        rules: {
            // Allow console statements in examples/samples
            'no-console': 'off',
            // Allow unused variables in examples (often for demonstration)
            'no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
        },
    },
    {
        // Ignore patterns
        ignores: ['dist/', 'node_modules/', '*.min.js'],
    },
];
