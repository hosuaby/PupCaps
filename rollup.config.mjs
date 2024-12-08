import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';

export default [{
    input: 'src/web/index.ts',
    output: {
        file: 'dist/web/index.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            vue: 'Vue',
        },
    },
    plugins: [
        typescript({
            tsconfig: './src/web/tsconfig.json',
        }),
        vue(),
        resolve({
            extensions: [ '.ts', '.vue' ],
        }),
   ],
    external: ['vue'],
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
        'commander', 'tmp', 'fluent-ffmpeg', 'pngjs', 'puppeteer', 'cli-progress', 'open', 'http-server', 'get-port',
        '@ffmpeg-installer/ffmpeg',
    ],
}];
