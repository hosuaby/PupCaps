import {createProgressBar, parseArgs, printArgs} from './cli';
import {parseCaptions} from './srt-captions-reader';
import {WorkDir} from './work-dir';
import {Recorder} from './recorder';
import {Renderer} from './renderer';
import {PreviewServer} from './preview-server';

const cliArgs = parseArgs();
const captions = parseCaptions(cliArgs.srtInputFile);
const progressBar = createProgressBar();

const workDir = new WorkDir(captions, cliArgs);
const renderer = new Renderer(cliArgs, workDir);
const recorder = new Recorder(captions, renderer, progressBar);
const previewServer = new PreviewServer(workDir);

(async () => {
    try {
        const indexHtml = workDir.setup();
        printArgs(cliArgs);

        if (!cliArgs.isPreview) {
            await recorder.recordCaptionsVideo(indexHtml);
        } else {
            console.log('Launching preview server...');
            await previewServer.start();
        }
        console.log('Done!');
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        workDir.clear();
    }
})();
