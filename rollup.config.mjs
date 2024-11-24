import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default [{
    input: 'src/web/index.ts',
    output: {
        file: 'dist/web/index.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        typescript({
            tsconfig: './src/web/tsconfig.json',
        }),
        resolve({
            extensions: ['.ts'],
        }),
   ]
}, {
    input: 'src/script/index.ts',
    output: {
        file: 'dist/script/index.js',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [
        resolve({
            extensions: ['.ts'],
        }),
        json(),
        commonjs(),
        typescript({
            tsconfig: './src/script/tsconfig.json',
        }),
    ],
    external: [
        'fs', 'path', 'os', 'stream', 'util',   // Node.js built-in modules
        'commander', 'tmp', 'fluent-ffmpeg', 'pngjs', 'puppeteer', 'cli-progress'
    ],
}];
