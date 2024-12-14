import {createServer} from 'http-server';

export class WebServer {
    constructor(private readonly rootDir: string) {
    }

    public async start(relativePath = '') {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const server = createServer({ root: this.rootDir });
                const port = await WebServer.getFreePort();

                server.listen(port, async () => {
                    try {
                        const childProcess = await WebServer.openUrl(`http://127.0.0.1:${port}${relativePath}`);

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