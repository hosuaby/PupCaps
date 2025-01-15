import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import copy from 'rollup-plugin-copy';

export default [{
    input: 'src/player/index.ts',
    output: {
        file: 'dist/player/index.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            vue: 'Vue',
        },
    },
    plugins: [
        typescript({
            tsconfig: './src/player/tsconfig.json',
        }),
        vue(),
        resolve({
            extensions: ['.ts', '.vue'],
        }),
    ],
    external: ['vue'],
}, {
    input: 'src/editor/index.ts',
    output: {
        file: 'dist/editor/index.js',
        format: 'iife',
        sourcemap: true,
        globals: {
            vue: 'Vue',
        },
    },
    plugins: [
        commonjs(),
        typescript({
            tsconfig: './src/editor/tsconfig.json',
        }),
        vue(),
        resolve({
            extensions: [ '.ts', '.vue' ],
        }),
        copy({
            targets: [
                { src: 'src/editor/index.html', dest: 'dist/editor' }
            ]
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
}, {
    input: 'src/script/srt-editor.ts',
    output: {
        file: 'dist/script/srt-editor.js',
        format: 'cjs',
        sourcemap: true,
    },
    plugins: [
        resolve({
            extensions: ['.ts'],
        }),
        typescript({
            tsconfig: './src/script/tsconfig.json',
        }),
    ],
    external: [
        'fs', 'path', 'os', 'stream', 'util',   // Node.js built-in modules
        'open', 'http-server', 'get-port',
    ],
}];
