// @ts-nocheck
import prettier from 'prettier/standalone';
import parserTypeScript from "prettier/parser-typescript";

export function formatTS (
    text,
    options = {
        singleQuote: true,
        printWidth: 140,
        tabWidth: 4
    }
) {
    return prettier.format(text, {
        parser: 'typescript',
        plugins: [parserTypeScript],
        ...options
    });
}
