import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import image from '@rollup/plugin-image';
import typescript from 'rollup-plugin-typescript2';
import styles from 'rollup-plugin-styles';
import externalGlobals from 'rollup-plugin-external-globals';
import terser from 'rollup-plugin-terser';
import svgr from '@svgr/rollup';

const inputOptions: any = {
    input: 'src/index.ts',
    external: [
        'lodash/cloneDeep',
        'lodash/forOwn',
        'lodash/get',
        'lodash/isArray',
        'lodash/isEmpty',
        'lodash/isObject',
        'lodash/uniqueId',
        'lodash/unionWith',
        'lodash/isEqual',
        '@headlessui/react',
        '@pancodex/bridge-lib',
        '@pancodex/domain-lib',
        '@pancodex/platform-lib',
        'react',
        'react-dom',
    ],
    plugins: [
        resolve(),
        svgr(),
        image(),
        commonjs(),
        styles({
            mode: ['extract', 'pancodex-theme.css']
        }),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        externalGlobals({
            '@headlessui/react': 'headlessuiReact',
            '@pancodex/bridge-lib': 'pancodexBridge',
            '@pancodex/platform-lib': 'pancodexPlatform',
            react: 'React',
            'react-dom': 'ReactDOM'
        }),
    ],
};

const outputOptions: any = {
    format: 'umd',
    name: 'PancodexTheme',
    file: 'dist/pancodex-theme.umd.js',
    assetFileNames: '[name][extname]',
};

const config: any = {
    ...inputOptions,
    output: [outputOptions],
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(terser.terser());
}

export default config;
