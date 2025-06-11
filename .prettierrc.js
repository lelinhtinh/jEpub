/** @type {import("prettier").Config} */
export default {
    // Basic formatting
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',

    // JSX settings
    jsxSingleQuote: true,

    // Trailing commas
    trailingComma: 'es5',

    // Spacing
    bracketSpacing: true,
    bracketSameLine: false,

    // Arrow functions
    arrowParens: 'always',

    // Line endings
    endOfLine: 'lf',

    // Embedded language formatting
    embeddedLanguageFormatting: 'auto',

    // HTML settings
    htmlWhitespaceSensitivity: 'css',

    // Vue settings
    vueIndentScriptAndStyle: false,

    // Prose wrap
    proseWrap: 'preserve',

    // Override for specific file types
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
                proseWrap: 'always',
            },
        },
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
