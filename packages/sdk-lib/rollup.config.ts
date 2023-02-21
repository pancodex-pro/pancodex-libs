import {readFileSync} from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        'lodash/upperFirst',
        'lodash/lowerFirst',
        'lodash/template',
        'prettier/standalone',
        'prettier/parser-typescript',
        'react',
        'react-dom',
        '@pancodex/domain-lib',
        'fs-extra',
        'path',
        'fs'
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({
            useTsconfigDeclarationDir: true,
        }),
    ],
};