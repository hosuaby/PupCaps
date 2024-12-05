import {Command} from '@commander-js/extra-typings';
import packageJson from '../../package.json';
import {defaultStylesCss} from './assets';
import * as cliProgress from 'cli-progress';
import * as path from 'path';

export interface Args {
    srtInputFile: string;
    movOutputFile: string;
    videoWidth: number;
    videoHeight: number;
    fps: number;
    styleFile: string;
    css3Animations: boolean;
    isPreview: boolean;
}

function parseIntAndAssert(...assertions: ((v: number) => void)[]): (v: string) => number {
    return (value: string) => {
        const int = parseInt(value, 10);
        assertions.forEach(assertion => assertion(int));
        return int;
    }
}

function assertPositive(option: string): (v: number) => void {
    return (value: number) => {
        if (value < 0) {
            throw new Error(`${option} should be positive!`);
        }
    };
}

function assertMinMax(option: string, min: number, max: number): (v: number) => void {
    return (value: number) => {
        if (value < min || value > max) {
            throw new Error(`${option} should be between ${min} and ${max}!`);
        }
    };
}

function assertFileExtension(ext: string): (v: string) => void {
    return (value: string) => {
        if (!value.endsWith(ext)) {
            throw new Error(`File should have extension ${ext}!`);
        }
        return value;
    };
}

const program = new Command();

program
    .name('pupcaps')
    .description('Tool to add stylish captions to your video.')
    .version(packageJson.version)
    .argument('<file>', 'Path to the input SubRip Subtitle (.srt) file.', assertFileExtension('.srt'))
    .option('-o, --output <file>',
        'Full or relative path where the created Films Apple QuickTime (MOV) file should be written. ' +
        'By default, it will be saved in the same directory as the input subtitle file.',
        assertFileExtension('.mov'))
    .option('-w, --width <number>',
        'Width of the video in pixels.',
        parseIntAndAssert(assertPositive('Width')),
        1080)
    .option('-h, --height <number>',
        'Height of the video in pixels.',
        parseIntAndAssert(assertPositive('Height')),
        1920)
    .option('-r, --fps <number>',
        'Specifies the frame rate (FPS) of the output video. Valid values are between 1 and 60.',
        parseIntAndAssert(assertMinMax('FPS', 1, 60)),
        30)
    .option('-s, --style <file>',
        'Full or relative path to the styles .css file. ' +
        'If not provided, default styles for captions will be used.',
        assertFileExtension('.css'))
    .option('-a, --animate',
        'Records captions with CSS3 animations. ' +
        'Note: The recording will run for the entire duration of the video. ' +
        'Use this option only if your captions involve CSS3 animations.')
    .option('--preview',
        'Prevents the script from generating a video file. ' +
        'Instead, captions are displayed in the browser for debugging and preview purposes.')
    .action((inputFile, options: any) => {
        if (!options.output) {
            const fileBasename = (inputFile as any as string).slice(0, -4);
            options.output = `${fileBasename}.mov`;
        }

        if (!options.style) {
            options.style = defaultStylesCss;
        } else {
            options.style = path.resolve(options.style);
        }
    });

export function parseArgs(): Args {
    program.parse();
    const opts = program.opts() as any;

    return {
        srtInputFile: program.args[0],
        movOutputFile: opts.output,
        videoWidth: opts.width,
        videoHeight: opts.height,
        fps: opts.fps,
        styleFile: opts.style,
        css3Animations: opts.animate,
        isPreview: opts.preview,
    };
}

export function printArgs(args: Args) {
    const styles = args.styleFile === defaultStylesCss
        ? '(Default)'
        : args.styleFile;

    const srt = `
    Output:     ${args.movOutputFile}
    Width:      ${args.videoWidth} px
    Height:     ${args.videoHeight} px
    FPS:        ${args.fps}
    Styles:     ${styles}
    Animations: ${ args.css3Animations ? 'yes' : 'no' }
    `;

    console.log(srt);
}

export function createProgressBar(): cliProgress.SingleBar {
    return new cliProgress.SingleBar({
        format: 'Progress |{bar}| {percentage}% || {value}/{total} Captions',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    }, cliProgress.Presets.shades_classic);
}