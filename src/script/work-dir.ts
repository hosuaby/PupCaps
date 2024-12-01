import * as tmp from 'tmp';
import * as path from 'path';
import {writeFileSync, symlinkSync, rmSync, mkdirSync} from 'fs';
import {Caption} from '../common/caption';
import {Args} from './cli';
import {indexHtml, indexJs} from './assets';

export class WorkDir {
    private readonly workDir = tmp.dirSync({ template: 'pupcaps-XXXXXX' });

    constructor(private readonly captions: Caption[],
                private readonly args: Args) {
    }

    public setup(): string {
        const index = path.join(this.workDir.name, 'index.html');

        symlinkSync(indexHtml, index);
        symlinkSync(indexJs, path.join(this.workDir.name, 'index.js'));
        symlinkSync(this.args.styleFile, path.join(this.workDir.name, 'captions.css'));

        this.setupCaptions();
        this.setupVideoSizeCss();

        mkdirSync(this.screenShotsDir);

        return index;
    }

    public clear() {
        rmSync(this.workDir.name, { recursive: true, force: true });
    }

    public get screenShotsDir(): string {
        return path.join(this.workDir.name, 'screenshots');
    }

    private setupVideoSizeCss() {
        const css= `#video {
            width: ${this.args.videoWidth}px;
            height: ${this.args.videoHeight}px;
        }`;
        const videoSizeFile = path.join(this.workDir.name, 'video.size.css');

        writeFileSync(videoSizeFile, css);
    }

    private setupCaptions() {
        const captionsJs = 'window.captions = ' + JSON.stringify(this.captions, null, 2);
        const captionsJsFile = path.join(this.workDir.name, 'captions.js');

        writeFileSync(captionsJsFile, captionsJs);
    }
}