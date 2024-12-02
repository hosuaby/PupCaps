import {createServer} from 'http-server';
import {WorkDir} from './work-dir';

export class PreviewServer {
    constructor(private readonly wordDir: WorkDir) {
    }

    public async start() {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const server = createServer({ root: this.wordDir.rootDir });
                const port = await PreviewServer.getFreePort();

                server.listen(port, async () => {
                    try {
                        const childProcess = await PreviewServer.openUrl(`http://127.0.0.1:${port}`);

                        childProcess.on('close', () => {
                            server.close(() => {
                                resolve();
                            });
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private static async getFreePort(): Promise<number> {
        const { default: getPort } = await import('get-port');
        return getPort();
    }

    private static async openUrl(url: string) {
        const { default: open } = await import('open');
        return open(url, { wait: true });
    }
}