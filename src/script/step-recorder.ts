import * as puppeteer from 'puppeteer';
import * as cliProgress from 'cli-progress';
import {PNG, PNGWithMetadata} from 'pngjs';
import {Caption, captionGroups} from '../common/captions';
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
        const groups = captionGroups(this.captions);

        this.progressBar.start(this.captions.length, 0);

        try {
            const videoElem = await this.launchBrowser(indexHtml);

            this.renderer.startEncoding();

            // Add empty frame before captions starts
            const beginningTime = this.captions[0].startTimeMs;
            this.renderer.addEmptyFrame(beginningTime);

            for (let i = 0; i < groups.length; i++) {
                const captionGroup = StepRecorder.adjustCaptionsDuration(groups[i]);

                for (const caption of captionGroup) {
                    await this.nextStep();
                    const screenShot = await this.takeScreenShot(videoElem!);
                    this.renderer.addFrame(caption, screenShot);
                    this.progressBar.increment();
                }

                // Add delay before the next caption group
                if (i < groups.length - 1) {
                    const nextCaptionGroup = groups[i + 1];
                    const lastCaption = captionGroup[captionGroup.length - 1];
                    const nextCaption = nextCaptionGroup[0];

                    const idleDelay = nextCaption.startTimeMs - lastCaption.endTimeMs;
                    if (idleDelay) {
                        this.renderer.addEmptyFrame(idleDelay);
                    }
                }
            }

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

    private static adjustCaptionsDuration(captionGroup: Caption[]): Caption[] {
        if (captionGroup.length < 2) {
            return captionGroup;
        }

        const adjustedGroup: Caption[] = [];

        for (let i = 0; i < captionGroup.length - 1; i++) {
            const caption = Object.assign({}, captionGroup[i]);
            const nextCaption = captionGroup[i + 1];
            caption.endTimeMs = nextCaption.startTimeMs;
            adjustedGroup.push(caption);
        }

        adjustedGroup.push(captionGroup[captionGroup.length - 1]);

        return adjustedGroup;
    }
}