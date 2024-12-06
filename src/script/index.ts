import {Args, createProgressBar, parseArgs, printArgs} from './cli';
import {parseCaptions} from './srt-captions-reader';
import {WorkDir} from './work-dir';
import {StepRenderer} from './step-renderer';
import {PreviewServer} from './preview-server';
import {RealTimeRecorder} from './real-time-recorder';
import {RealTimeRenderer} from './real-time-renderer';
import {StepRecorder} from './step-recorder';
import {AbstractRecorder} from './abstract-recorder';
import {Caption} from '../common/caption';

function createRecorder(args: Args, captions: Caption[], workDir: WorkDir): AbstractRecorder {
    if (args.css3Animations) {
        const realTimeRenderer = new RealTimeRenderer(args);
        return new RealTimeRecorder(args, realTimeRenderer);
    } else {
        const progressBar = createProgressBar();
        const stepRenderer = new StepRenderer(args, workDir);
        return  new StepRecorder(args, captions, stepRenderer, progressBar);
    }
}

const cliArgs = parseArgs();
const captions = parseCaptions(cliArgs.srtInputFile);
const workDir = new WorkDir(captions, cliArgs);

(async () => {
    try {
        const indexHtml = workDir.setup();
        printArgs(cliArgs);

        if (!cliArgs.isPreview) {
            const recorder = createRecorder(cliArgs, captions, workDir);
            await recorder.recordCaptionsVideo(indexHtml);
        } else {
            console.log('Launching preview server...');
            const previewServer = new PreviewServer(workDir);
            await previewServer.start();
        }
        console.log('Done!');
    } catch (err) {
        console.error('Error occurred:', err);
    } finally {
        workDir.clear();
    }
})();
