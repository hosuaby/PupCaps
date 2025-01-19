import {Args} from './cli';
import {PNG, PNGWithMetadata} from 'pngjs';
import * as path from 'path';
import {appendFileSync, writeFileSync} from 'fs';
import {WorkDir} from './work-dir';
import {Caption} from '../common/captions';
import {StatsPrinter} from './stats-printer';
import {AbstractRenderer} from './abstract-renderer';

export class StepRenderer extends AbstractRenderer {
    private readonly framesFileName: string;
    private readonly emptyFrameFileName: string;

    constructor(args : Args,
                private readonly workDir: WorkDir) {
        super(args);
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

    public async endEncoding() {
        console.log(`Encoding ${this.args.movOutputFile}...\n`);
        const statsPrinter = new StatsPrinter();

        await new Promise((resolve, reject) => {
            this.baseFfmpegCommand()
                .input(this.framesFileName)
                .inputOptions([
                    '-f concat',    // concat frames from the frame list
                    '-safe 0'       // to prevent errors related to unsafe filenames
                ])
                .outputOptions([
                    `-vf fps=fps=${this.args.fps}`,  // Framerate
                ])
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