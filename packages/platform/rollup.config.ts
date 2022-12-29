import {readFileSync} from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        'react',
        'react-dom'
    ],
    plugins: [
        resolve({ preferBuiltins: true }),
        commonjs(),
        typescript({
            useTsconfigDeclarationDir: true,
        }),
    ],
};