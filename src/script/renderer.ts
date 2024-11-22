import {Args} from './cli';
import GIFEncoder from 'gif-encoder';
import {createWriteStream} from 'fs';

export class Renderer {
    private readonly encoder: GIFEncoder;

    constructor(private readonly args : Args) {
        this.encoder = new GIFEncoder(args.videoWidth, args.videoHeight);

        this.encoder.setRepeat(-1);                             // 0 = loop forever, -1 = no repeat
        this.encoder.setQuality(this.args.renderingQuality);    // Quality: lower is better, 10 is default
        this.encoder.setDispose(2);
        this.encoder.setTransparent(0x0000000);
        this.encoder.writeHeader();
    }

    public startEncoding() {
        const stream = createWriteStream(this.args.gifOutputFile);
        this.encoder.pipe(stream);
    }

    public addEmptyFrame(durationMs?: number) {
        this.addFrame([], durationMs);
    }

    public addFrame(buffer: Buffer<ArrayBufferLike> | never[], durationMs?: number) {
        if (durationMs) {
            this.encoder.setDelay(durationMs);
        }

        this.encoder.addFrame(buffer);
    }

    public finishEncoding() {
        this.encoder.finish();
    }
}