import {PassThrough} from 'stream';
import {PNG} from 'pngjs';
import {Args} from './cli';
import {StatsPrinter} from './stats-printer';
import {AbstractRenderer} from './abstract-renderer';

export class RealTimeRenderer extends AbstractRenderer {
    private inputStream: PassThrough | null = null;
    private intervalId: NodeJS.Timeout | null = null;
    private lastFrame: Buffer;

    constructor(args: Args) {
        super(args);
        const empty = new PNG({
            width: this.args.videoWidth,
            height: this.args.videoHeight,
            colorType: 6,
        });
        this.lastFrame = PNG.sync.write(empty);
    }

    public startEncoding() {
        this.inputStream = new PassThrough();
        const statsPrinter = new StatsPrinter();

        const command = this.baseFfmpegCommand()
            .input(this.inputStream)
            .inputOptions([
                '-f image2pipe',                                        // Format of input frames
                '-pix_fmt yuva444p10le',                                // Lossless setting
                `-s ${this.args.videoWidth}x${this.args.videoHeight}`,  // Frame size
                `-r ${this.args.fps}`,                                  // Framerate
            ])
            .on('start', () => {
                console.log('FFmpeg process started.');
            })
            .on('progress', (progress) => {
                statsPrinter.print(progress);
            })
            .on('end', () => {
                console.log('FFmpeg process completed.');
            })
            .on('error', (err) => {
                console.error('An error occurred:', err.message);
            });

        command.run();

        // Produce frames in required rate
        const intervalDuration = Math.round(1000 / 30);
        this.intervalId = setInterval(() => {
            this.inputStream!.write(this.lastFrame);
        }, intervalDuration);
    }

    public addFrame(frame: Buffer) {
        this.lastFrame = frame;
    }

    public endEncoding() {
        clearTimeout(this.intervalId!);
        this.inputStream!.end();
    }
}