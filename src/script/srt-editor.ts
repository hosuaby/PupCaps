import * as path from 'path';
import {WebServer} from '../common/web-server';

const rootDir = path.join(__dirname, '..', '..');
const webServer = new WebServer(rootDir);

(async () => {
    await webServer.start('/dist/editor/index.html');
})();