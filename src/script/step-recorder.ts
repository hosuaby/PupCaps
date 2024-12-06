import * as puppeteer from 'puppeteer';
import * as cliProgress from 'cli-progress';
import {PNG, PNGWithMetadata} from 'pngjs';
import {Caption} from '../common/caption';
import {StepRenderer} from './step-renderer';
import {Args} from './cli';
import {AbstractRecorder} from './abstract-recorder';

export class StepRecorder extends AbstractRecorder {
    constructor(args: Args,
                private readonly captions: Caption[],
                private readonly renderer: StepRenderer,
                private readonly progressBar: cliProgress.SingleBar) {
        super(args);
    }

    public async recordCaptionsVideo(indexHtml: string) {
        this.progressBar.start(this.captions.length, 0);

        try {
            const videoElem = await this.launchBrowser(indexHtml);

            this.renderer.startEncoding();

            // Add empty frame before captions starts
            const beginningTime = this.captions[0].startTimeMs;
            this.renderer.addEmptyFrame(beginningTime);

            for (let i = 0; i < this.captions.length; i++) {
                const caption = this.captions[i];

                await this.nextStep();

                const screenShot = await this.takeScreenShot(videoElem!);
                this.renderer.addFrame(caption, screenShot);

                // Add delay before the next frame
                if (i < this.captions.length - 1) {
                    const idleDelay = this.captions[i + 1].startTimeMs - caption.endTimeMs;
                    if (idleDelay) {
                        this.renderer.addEmptyFrame(idleDelay);
                    }
                }

                this.progressBar.increment();
            }

            // Finish with en empty frame
            this.renderer.addEmptyFrame();

            this.progressBar.stop();
            await this.renderer.endEncoding();
        } catch (error) {
            console.error('Error during Puppeteer operation:', error);
        } finally {
            await this.browser?.close();
        }
    }

    private async nextStep() {
        await this.page!.evaluate(() => {
            window.Player.next();
        });
    }

    private async takeScreenShot(elem: puppeteer.ElementHandle): Promise<PNGWithMetadata> {
        const screenshotBuffer = await elem.screenshot({
            encoding: 'binary',
            omitBackground: true,
        });
        return PNG.sync.read(Buffer.from(screenshotBuffer));
    }
}