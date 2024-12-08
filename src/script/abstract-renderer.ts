import ffmpeg, { setFfmpegPath } from 'fluent-ffmpeg';
import {Args} from './cli';

(() => {
    try {
        const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
        setFfmpegPath(ffmpegInstaller!.path);
    } catch (error) {
        console.warn('Impossible to install FFMpeg. Use system-provided ffmpeg.');
    }
})();

export abstract class AbstractRenderer {
    protected constructor(protected readonly args : Args) {
    }

    public abstract startEncoding(): void;
    public abstract endEncoding(): void;

    protected baseFfmpegCommand(): ffmpeg.FfmpegCommand {
        return ffmpeg()
            .outputOptions([
                '-c:v prores_ks',           // codec for Films Apple QuickTime (MOV)
                '-profile:v 4444',          // enable the best quality
                '-pix_fmt yuva444p10le',    // lossless setting
                '-q:v 0',                   // lossless setting
                '-vendor ap10'              // ensures the output MOV file is compatible with Apple QuickTime
            ])
            .output(this.args.movOutputFile);
    }
}