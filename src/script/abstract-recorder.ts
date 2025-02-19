import * as puppeteer from 'puppeteer';
import {Args} from './cli';

const MAX_INT_32 = (2 ** 31) - 1;

export abstract class AbstractRecorder {
    protected browser: puppeteer.Browser | null = null;
    protected page: puppeteer.Page | null = null;

    protected constructor(protected readonly args: Args) {
    }

    public abstract recordCaptionsVideo(indexHtml: string): Promise<void>;

    protected async launchBrowser(indexHtml: string): Promise<puppeteer.ElementHandle | null> {
        this.browser = await puppeteer.launch({
            args: [
                '--disable-web-security',           // Disable CORS
                '--allow-file-access-from-files',   // Allow file access
            ],
            headless: true,
            protocolTimeout: MAX_INT_32,
        });
        this.page = await this.browser.newPage();
        await this.page.goto(`file://${indexHtml}`);
        await this.page.setViewport({
            width: this.args.videoWidth,
            height: this.args.videoHeight,
        });
        await this.page.evaluate(() => {
            return window.ready;
        });

        return this.page.$('#video');
    }
}