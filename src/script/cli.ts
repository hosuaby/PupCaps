import {Command} from '@commander-js/extra-typings';
import packageJson from '../../package.json';
import {defaultStylesCss} from './assets';
import * as cliProgress from 'cli-progress';

export interface Args {
    srtInputFile: string;
    gifOutputFile: string;
    videoWidth: number;
    videoHeight: number;
    styleFile: string;
    renderingQuality: number;
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
            throw new Error(`${option} must be a number between ${min} and ${max}.`);
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
    .name('PupCaps!')
    .description('Tool to add stylish captions to your video.')
    .version(packageJson.version)
    .argument('<file>', 'Path to the input SubRip Subtitle (.srt) file.', assertFileExtension('.srt'))
    .option('-o, --output <file>',
        `Full or relative path where the created animated GIF file should be written.
        By default, it will be saved in the same directory as the input subtitle file.`)
    .option('-w, --width <number>',
        'Width of the video in pixels (default: 1080).',
        parseIntAndAssert(assertPositive('Width')),
        1080)
    .option('-h, --height <number>',
        'Height of the video in pixels (default: 1920).',
        parseIntAndAssert(assertPositive('Height')),
        1920)
    .option('-s, --style <file>',
        `Full or relative path to the styles .css file.
        If not provided, default styles for captions will be used.`,
        assertFileExtension('.css'))
    .option('-q, --quality <number>',
        'Quality of rendering. A number between 1 and 20 (default: 10). Lower numbers indicate better quality.',
        parseIntAndAssert(assertPositive('Quality'), assertMinMax('Quality', 1, 20)),
        10)
    .action((inputFile, options: any) => {
        if (!options.output) {
            const fileBasename = (inputFile as any as string).slice(0, -4);
            options.output = `${fileBasename}.gif`;
        }

        if (!options.style) {
            options.style = defaultStylesCss;
        }
    });

export function parseArgs(): Args {
    program.parse();
    const opts = program.opts() as any;

    return {
        srtInputFile: program.args[0],
        gifOutputFile: opts.output,
        videoWidth: opts.width,
        videoHeight: opts.height,
        styleFile: opts.style,
        renderingQuality: opts.quality,
    };
}

export function printArgs(args: Args) {
    const styles = args.styleFile === defaultStylesCss
        ? '(Default)'
        : args.styleFile;

    const srt = `
    Output:     ${args.gifOutputFile}
    Width:      ${args.videoWidth} px
    Height:     ${args.videoHeight} px
    Styles:     ${styles}
    Quality:    ${args.renderingQuality} (of 20; lower is better)
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