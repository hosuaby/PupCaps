import {PassThrough} from 'stream';
import ffmpeg from 'fluent-ffmpeg';
import {PNG} from 'pngjs';
import {Args} from './cli';
import {StatsPrinter} from './stats-printer';

export class VideoRenderer {
    private inputStream: PassThrough | null = null;
    private intervalId: NodeJS.Timeout | null = null;
    private lastFrame: Buffer;

    constructor(private readonly args: Args) {
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

        const command = ffmpeg()
            .input(this.inputStream)
            .inputOptions([
                '-f image2pipe',                                        // Format of input frames
                '-pix_fmt yuva444p10le',                                // Lossless setting
                `-s ${this.args.videoWidth}x${this.args.videoHeight}`,  // Frame size
                `-r ${this.args.fps}`,                                  // Framerate
            ])
            .outputOptions([
                '-c:v prores_ks',           // codec for Films Apple QuickTime (MOV)
                '-profile:v 4444',          // enable the best quality
                '-pix_fmt yuva444p10le',    // lossless setting
                '-q:v 0',                   // lossless setting
                '-vendor ap10'              // ensures the output MOV file is compatible with Apple QuickTime
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
            })
            .output(this.args.movOutputFile);

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