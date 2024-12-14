import * as tmp from 'tmp';
import * as path from 'path';
import {writeFileSync, symlinkSync, rmSync, mkdirSync} from 'fs';
import {Caption} from '../common/captions';
import {Args} from './cli';
import {indexHtml, indexJs, nodeModules} from './assets';
import {PlayerArgs} from '../common/player-args';

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
        symlinkSync(nodeModules, path.join(this.workDir.name, 'node_modules'));

        this.setupCaptions();
        this.setupPlayerArgs();
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

    public get rootDir(): string {
        return this.workDir.name;
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

    private setupPlayerArgs() {
        const playerArgs: PlayerArgs = {
            isPreview: this.args.isPreview,
        };
        const argsJs = 'window.playerArgs = ' + JSON.stringify(playerArgs, null, 2);
        const argsJsFile = path.join(this.workDir.name, 'player.args.js');

        writeFileSync(argsJsFile, argsJs);
    }
}