'use strict';

var path = require('path');
var httpServer = require('http-server');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

class WebServer {
    rootDir;
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    async start(relativePath = '') {
        return new Promise(async (resolve, reject) => {
            try {
                const server = httpServer.createServer({ root: this.rootDir });
                const port = await WebServer.getFreePort();
                server.listen(port, async () => {
                    try {
                        const childProcess = await WebServer.openUrl(`http://127.0.0.1:${port}${relativePath}`);
                        childProcess.on('close', () => {
                            server.close(() => {
                                resolve();
                            });
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    static async getFreePort() {
        const { default: getPort } = await import('get-port');
        return getPort();
    }
    static async openUrl(url) {
        const { default: open } = await import('open');
        return open(url, { wait: true });
    }
}

const rootDir = path__namespace.join(__dirname, '..', '..');
const webServer = new WebServer(rootDir);
(async () => {
    await webServer.start('/dist/editor/index.html');
})();
//# sourceMappingURL=srt-editor.js.map
