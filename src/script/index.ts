import {createProgressBar, parseArgs, printArgs} from './cli';
import {parseCaptions} from './srt-captions-reader';
import {WorkDir} from './work-dir';
import {Renderer} from './renderer';
import {PreviewServer} from './preview-server';
import {VideoRecorder} from './video-recorder';
import {VideoRenderer} from './video-renderer';
import {StepRecorder} from './step-recorder';

const cliArgs = parseArgs();
const captions = parseCaptions(cliArgs.srtInputFile);
const progressBar = createProgressBar();

const workDir = new WorkDir(captions, cliArgs);
const renderer = new Renderer(cliArgs, workDir);
const stepRecorder = new StepRecorder(cliArgs, captions, renderer, progressBar);
const videoRenderer = new VideoRenderer(cliArgs);
const videoRecorder = new VideoRecorder(cliArgs, videoRenderer);
const previewServer = new PreviewServer(workDir);

(async () => {
    try {
        const indexHtml = workDir.setup();
        printArgs(cliArgs);

        if (!cliArgs.isPreview) {
            if (cliArgs.css3Animations) {
                await videoRecorder.recordCaptionsVideo(indexHtml);
            } else {
                await stepRecorder.recordCaptionsVideo(indexHtml);
            }
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
