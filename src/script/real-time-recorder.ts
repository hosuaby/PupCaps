import * as puppeteer from 'puppeteer';
import {RealTimeRenderer} from './real-time-renderer';
import {Args} from './cli';
import {AbstractRecorder} from './abstract-recorder';

export class RealTimeRecorder extends AbstractRecorder {
    constructor(args: Args,
                private readonly videoRenderer: RealTimeRenderer) {
        super(args);
    }

    public async recordCaptionsVideo(indexHtml: string) {
        try {
            await this.launchBrowser(indexHtml);
            const cdpSession = await this.page!.createCDPSession();

            await cdpSession.send(
                'Emulation.setDefaultBackgroundColorOverride',
                { color: { r: 0, g: 0, b: 0, a: 0 } }
            );
            await cdpSession.send('Animation.setPlaybackRate', {
                playbackRate: 1,
            });

            cdpSession.on('Page.screencastFrame',
                (frame) => this.handleScreenCastFrame(cdpSession, frame));

            this.videoRenderer.startEncoding();

            await cdpSession.send('Page.startScreencast', {
                everyNthFrame: 1,
                format: 'png',
                quality: 100,
            });

            await this.page!.evaluate(() => {
                return new Promise<void>((resolve) => {
                    window.Player.onStop = resolve;
                    window.Player.play();
                })
            });

            await cdpSession.send('Page.stopScreencast');

            this.videoRenderer.endEncoding();
        } catch (error) {
            console.error('Error during Puppeteer operation:', error);
        } finally {
            await this.browser?.close();
        }
    }

    private async handleScreenCastFrame(cdpSession: puppeteer.CDPSession,
                                        frame: puppeteer.Protocol.Page.ScreencastFrameEvent) {
        const { sessionId, data } = frame;
        await cdpSession.send('Page.screencastFrameAck', { sessionId });
        const frameBuffer = Buffer.from(data, 'base64');
        this.videoRenderer.addFrame(frameBuffer);
    }
}