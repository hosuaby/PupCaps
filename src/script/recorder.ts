import * as puppeteer from 'puppeteer';
import * as cliProgress from 'cli-progress';
import {PNG} from 'pngjs';
import {Caption} from '../common/caption';
import {Renderer} from './renderer';

export class Recorder {
    private browser: puppeteer.Browser | null = null;
    private page: puppeteer.Page | null = null;

    constructor(private readonly captions: Caption[],
                private readonly renderer: Renderer,
                private readonly progressBar: cliProgress.SingleBar) {
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
                const frameDuration = caption.endTimeMs - caption.startTimeMs;
                this.renderer.addFrame(screenShot, frameDuration);

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

            this.renderer.finishEncoding();
        } catch (error) {
            console.error('Error during Puppeteer operation:', error);
        } finally {
            this.progressBar.stop();
            await this.browser?.close();
        }
    }

    private async launchBrowser(indexHtml: string): Promise<puppeteer.ElementHandle | null> {
        this.browser = await puppeteer.launch({
            args: [
                '--disable-web-security',           // Disable CORS
                '--allow-file-access-from-files',   // Allow file access
            ],
            headless: true,
        });
        this.page = await this.browser.newPage();
        await this.page.goto(`file://${indexHtml}`);
        await this.page.evaluate(() => {
            return window.ready;
        });

        return this.page.$('#video');
    }

    private async nextStep() {
        await this.page!.evaluate(() => {
            window.Player.next();
        });
    }

    private async takeScreenShot(elem: puppeteer.ElementHandle): Promise<Buffer<ArrayBufferLike>> {
        const screenshotBuffer = await elem.screenshot({
            encoding: 'binary',
            omitBackground: true,
        });
        const png = PNG.sync.read(Buffer.from(screenshotBuffer));
        return png.data;
    }
}