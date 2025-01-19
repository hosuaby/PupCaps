import {PassThrough} from 'stream';
import {PNG} from 'pngjs';
import {Args} from './cli';
import {StatsPrinter} from './stats-printer';
import {AbstractRenderer} from './abstract-renderer';
import {FPSTicker} from './fps-ticker';

export class RealTimeRenderer extends AbstractRenderer {
    private inputStream: PassThrough | null = null;
    private lastFrame: Buffer;
    private readonly ticker: FPSTicker;

    constructor(args: Args) {
        super(args);
        const empty = new PNG({
            width: this.args.videoWidth,
            height: this.args.videoHeight,
            colorType: 6,
        });
        this.lastFrame = PNG.sync.write(empty);
        this.ticker = new FPSTicker(args.fps);
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
            .outputOptions([
                `-vf fps=fps=${this.args.fps}`,     // Framerate
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
        this.ticker.start(() => {
            this.inputStream!.write(this.lastFrame);
        });
    }

    public addFrame(frame: Buffer) {
        this.lastFrame = frame;
    }

    public endEncoding() {
        this.ticker.stop();
        this.inputStream!.end();
    }
}