import {createProgressBar, parseArgs, printArgs} from './cli';
import {parseCaptions} from './srt-captions-reader';
import {WorkDir} from './work-dir';
import {Recorder} from './recorder';
import {Renderer} from './renderer';

const cliArgs = parseArgs();
const captions = parseCaptions(cliArgs.srtInputFile);
const progressBar = createProgressBar();

const workDir = new WorkDir(captions, cliArgs);
const renderer = new Renderer(cliArgs, workDir);
const recorder = new Recorder(captions, renderer, progressBar);

(async () => {
    try {
        const indexHtml = workDir.setup();
        printArgs(cliArgs);
        await recorder.recordCaptionsVideo(indexHtml);
        console.log('Done!');
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        workDir.clear();
    }
})();