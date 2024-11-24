import {Args} from './cli';
import {PNG, PNGWithMetadata} from 'pngjs';
import * as path from 'path';
import {appendFileSync, writeFileSync} from 'fs';
import {WorkDir} from './work-dir';
import {Caption} from '../common/caption';
import ffmpeg from 'fluent-ffmpeg';
import {StatsPrinter} from './stats-printer';

export class Renderer {
    private readonly framesFileName: string;
    private readonly emptyFrameFileName: string;

    constructor(private readonly args : Args,
                private readonly workDir: WorkDir) {
        this.framesFileName = path.join(workDir.screenShotsDir, 'frames.txt');
        this.emptyFrameFileName = path.join(workDir.screenShotsDir, 'empty.png');
    }

    public startEncoding() {
        const empty = new PNG({
            width: this.args.videoWidth,
            height: this.args.videoHeight,
            colorType: 6,
        });
        writeFileSync(this.emptyFrameFileName, PNG.sync.write(empty));
    }

    public addEmptyFrame(durationMs?: number) {
        let frameDef = `file '${this.emptyFrameFileName}'\n`;

        if (durationMs) {
            const durationSec = durationMs / 1000;
            frameDef += `duration ${durationSec}\n`;
        }

        appendFileSync(this.framesFileName, frameDef, 'utf8');
    }

    public addFrame(caption: Caption, png: PNGWithMetadata) {
        const screenShotFileName = path.join(this.workDir.screenShotsDir, `screenshot_${caption.index}.png`);
        writeFileSync(screenShotFileName, PNG.sync.write(png));

        const durationSec = (caption.endTimeMs - caption.startTimeMs) / 1000;

        appendFileSync(
            this.framesFileName,
            `file '${screenShotFileName}'\nduration ${durationSec}\n`,
            'utf8');
    }

    public async render() {
        console.log(`Encoding ${this.args.movOutputFile}...\n`);
        const statsPrinter = new StatsPrinter();

        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(this.framesFileName)
                .inputOptions([
                    '-f concat',    // concat frames from the frame list
                    '-safe 0'       // to prevent errors related to unsafe filenames
                ])
                .outputOptions([
                    '-c:v prores_ks',           // codec for Films Apple QuickTime (MOV)
                    '-profile:v 4444',          // enable the best quality
                    '-pix_fmt yuva444p10le',    // lossless setting
                    '-q:v 0',                   // lossless setting
                    '-vendor ap10'              // ensures the output MOV file is compatible with Apple QuickTime
                ])
                .output(this.args.movOutputFile)
                .on('progress', (progress: Object) => {
                    statsPrinter.print(progress);
                })
                .on('end', () => {
                    console.log(`${this.args.movOutputFile} encoded`);
                    resolve(this.args.movOutputFile);
                })
                .on('error', (err: any) => {
                    reject(err);
                })
                .run();
        });
    }
}