'use strict';

var require$$0 = require('commander');
var path = require('path');
var cliProgress = require('cli-progress');
var fs = require('fs');
var tmp = require('tmp');
var puppeteer = require('puppeteer');
var pngjs = require('pngjs');
var ffmpeg = require('fluent-ffmpeg');

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
var cliProgress__namespace = /*#__PURE__*/_interopNamespaceDefault(cliProgress);
var tmp__namespace = /*#__PURE__*/_interopNamespaceDefault(tmp);
var puppeteer__namespace = /*#__PURE__*/_interopNamespaceDefault(puppeteer);

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var extraTypings = {exports: {}};

var hasRequiredExtraTypings;

function requireExtraTypings () {
	if (hasRequiredExtraTypings) return extraTypings.exports;
	hasRequiredExtraTypings = 1;
	(function (module, exports) {
		const commander = require$$0;

		exports = module.exports = {};

		// Return a different global program than commander,
		// and don't also return it as default export.
		exports.program = new commander.Command();

		/**
		 * Expose classes. The FooT versions are just types, so return Commander original implementations!
		 */

		exports.Argument = commander.Argument;
		exports.Command = commander.Command;
		exports.CommanderError = commander.CommanderError;
		exports.Help = commander.Help;
		exports.InvalidArgumentError = commander.InvalidArgumentError;
		exports.InvalidOptionArgumentError = commander.InvalidArgumentError; // Deprecated
		exports.Option = commander.Option;

		// In Commander, the create routines end up being aliases for the matching
		// methods on the global program due to the (deprecated) legacy default export.
		// Here we roll our own, the way Commander might in future.
		exports.createCommand = (name) => new commander.Command(name);
		exports.createOption = (flags, description) =>
		  new commander.Option(flags, description);
		exports.createArgument = (name, description) =>
		  new commander.Argument(name, description); 
	} (extraTypings, extraTypings.exports));
	return extraTypings.exports;
}

var extraTypingsExports = requireExtraTypings();
var extraTypingsCommander = /*@__PURE__*/getDefaultExportFromCjs(extraTypingsExports);

// wrapper to provide named exports for ESM.
const {
  program: program$1,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError, // deprecated old name
  Command,
  Argument,
  Option,
  Help,
} = extraTypingsCommander;

var name = "pupcaps";
var version = "1.0.0-alpha";
var description = "PupCaps! : A script to add stylish captions to your videos.";
var author = "Alexei KLENIN <alexei.klenin@gmail.com> (https://github.com/hosuaby)";
var license = "Apache-2.0";
var main = "dist/script/index.js";
var bin = {
	pupcaps: "./pupcaps"
};
var repository = {
	type: "git",
	url: "git+https://github.com/hosuaby/PupCaps.git"
};
var bugs = {
	url: "https://github.com/hosuaby/PupCaps/issues"
};
var homepage = "https://github.com/hosuaby/PupCaps#readme";
var keywords = [
	"subtitles",
	"captions",
	"caps",
	"video"
];
var dependencies = {
	"cli-progress": "^3.12.0",
	commander: "^12.1.0",
	"fluent-ffmpeg": "^2.1.3",
	pngjs: "^7.0.0",
	puppeteer: "^23.9.0",
	tmp: "^0.2.3"
};
var devDependencies = {
	"@commander-js/extra-typings": "^12.1.0",
	"@rollup/plugin-commonjs": "^28.0.1",
	"@rollup/plugin-json": "^6.1.0",
	"@rollup/plugin-node-resolve": "^15.3.0",
	"@types/chai": "^5.0.1",
	"@types/cli-progress": "^3.11.6",
	"@types/fluent-ffmpeg": "^2.1.27",
	"@types/mocha": "^10.0.10",
	"@types/node": "^22.9.1",
	"@types/pngjs": "^6.0.5",
	"@types/tmp": "^0.2.6",
	chai: "^5.1.2",
	mocha: "^10.8.2",
	rollup: "^4.27.3",
	"rollup-plugin-typescript2": "^0.36.0",
	tsx: "^4.19.2",
	typescript: "^5.7.2"
};
var scripts = {
	build: "rollup -c",
	test: "mocha"
};
var packageJson = {
	name: name,
	version: version,
	description: description,
	author: author,
	license: license,
	main: main,
	bin: bin,
	repository: repository,
	bugs: bugs,
	homepage: homepage,
	keywords: keywords,
	dependencies: dependencies,
	devDependencies: devDependencies,
	scripts: scripts
};

const assetsFolder = path__namespace.join(__dirname, '..', '..', 'assets');
const defaultStylesCss = path__namespace.join(assetsFolder, 'captions.css');
const indexHtml = path__namespace.join(assetsFolder, 'index.html');
const indexJs = path__namespace.join(__dirname, '..', 'web', 'index.js');

function parseIntAndAssert(...assertions) {
    return (value) => {
        const int = parseInt(value, 10);
        assertions.forEach(assertion => assertion(int));
        return int;
    };
}
function assertPositive(option) {
    return (value) => {
        if (value < 0) {
            throw new Error(`${option} should be positive!`);
        }
    };
}
function assertFileExtension(ext) {
    return (value) => {
        if (!value.endsWith(ext)) {
            throw new Error(`File should have extension ${ext}!`);
        }
        return value;
    };
}
const program = new Command();
program
    .name('PupCaps!')
    .description('Tool to add stylish captions to your video.')
    .version(packageJson.version)
    .argument('<file>', 'Path to the input SubRip Subtitle (.srt) file.', assertFileExtension('.srt'))
    .option('-o, --output <file>', `Full or relative path where the created Films Apple QuickTime (MOV) file should be written.
        By default, it will be saved in the same directory as the input subtitle file.`, assertFileExtension('.mov'))
    .option('-w, --width <number>', 'Width of the video in pixels (default: 1080).', parseIntAndAssert(assertPositive('Width')), 1080)
    .option('-h, --height <number>', 'Height of the video in pixels (default: 1920).', parseIntAndAssert(assertPositive('Height')), 1920)
    .option('-s, --style <file>', `Full or relative path to the styles .css file.
        If not provided, default styles for captions will be used.`, assertFileExtension('.css'))
    .action((inputFile, options) => {
    if (!options.output) {
        const fileBasename = inputFile.slice(0, -4);
        options.output = `${fileBasename}.mov`;
    }
    if (!options.style) {
        options.style = defaultStylesCss;
    }
    else {
        options.style = path__namespace.resolve(options.style);
    }
});
function parseArgs() {
    program.parse();
    const opts = program.opts();
    return {
        srtInputFile: program.args[0],
        movOutputFile: opts.output,
        videoWidth: opts.width,
        videoHeight: opts.height,
        styleFile: opts.style,
    };
}
function printArgs(args) {
    const styles = args.styleFile === defaultStylesCss
        ? '(Default)'
        : args.styleFile;
    const srt = `
    Output:     ${args.movOutputFile}
    Width:      ${args.videoWidth} px
    Height:     ${args.videoHeight} px
    Styles:     ${styles}
    `;
    console.log(srt);
}
function createProgressBar() {
    return new cliProgress__namespace.SingleBar({
        format: 'Progress |{bar}| {percentage}% || {value}/{total} Captions',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
    }, cliProgress__namespace.Presets.shades_classic);
}

const indexLinePattern = /^\d+$/;
const timecodesLinePattern = /^(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})$/;
const highlightedWordPattern = /^\[(.+)]$/;
function parseCaptions(srtCaptionsFile) {
    const captionsSrc = fs.readFileSync(srtCaptionsFile, 'utf-8');
    return readCaptions(captionsSrc);
}
function readCaptions(srtContent) {
    const lines = srtContent.split('\n');
    const captions = [];
    let index = 0;
    let timecodesStart = null;
    let timecodesEnd = null;
    for (const line of lines) {
        let match;
        if ((match = line.match(indexLinePattern))) {
            index = Number(line);
        }
        else if ((match = line.match(timecodesLinePattern))) {
            timecodesStart = match[1];
            timecodesEnd = match[2];
        }
        else if (line.length) {
            const start = toMillis(timecodesStart);
            const end = toMillis(timecodesEnd);
            const words = readWords(line);
            captions.push({
                index,
                words,
                startTimeMs: start,
                endTimeMs: end,
            });
        }
    }
    return captions;
}
function readWords(text) {
    const words = text.split(/\s+/);
    const highlightedIndex = words.findIndex(word => word.match(highlightedWordPattern));
    const res = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const match = word.match(highlightedWordPattern);
        const rawWord = match ? match[1] : word;
        const isHighlighted = Boolean(match);
        const isBeforeHighlighted = Boolean(~highlightedIndex && !isHighlighted && i < highlightedIndex);
        const isAfterHighlighted = Boolean(~highlightedIndex && !isHighlighted && i > highlightedIndex);
        res.push({
            rawWord,
            isHighlighted,
            isBeforeHighlighted,
            isAfterHighlighted,
        });
    }
    return res;
}
function toMillis(timecodes) {
    const parts = timecodes.split(/[:.]/).map(Number);
    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts[2];
    const milliseconds = parts[3];
    return hours * 3_600_000 // hours to millis
        + minutes * 60_000 // minutes to millis
        + seconds * 1000 // second to millis
        + milliseconds;
}

class WorkDir {
    captions;
    args;
    workDir = tmp__namespace.dirSync({ template: 'pupcaps-XXXXXX' });
    constructor(captions, args) {
        this.captions = captions;
        this.args = args;
    }
    setup() {
        const index = path__namespace.join(this.workDir.name, 'index.html');
        fs.symlinkSync(indexHtml, index);
        fs.symlinkSync(indexJs, path__namespace.join(this.workDir.name, 'index.js'));
        fs.symlinkSync(this.args.styleFile, path__namespace.join(this.workDir.name, 'captions.css'));
        this.setupCaptions();
        this.setupVideoSizeCss();
        fs.mkdirSync(this.screenShotsDir);
        return index;
    }
    clear() {
        fs.rmSync(this.workDir.name, { recursive: true, force: true });
    }
    get screenShotsDir() {
        return path__namespace.join(this.workDir.name, 'screenshots');
    }
    setupVideoSizeCss() {
        const css = `#video {
            width: ${this.args.videoWidth}px;
            height: ${this.args.videoHeight}px;
        }`;
        const videoSizeFile = path__namespace.join(this.workDir.name, 'video.size.css');
        fs.writeFileSync(videoSizeFile, css);
    }
    setupCaptions() {
        const captionsJs = 'window.captions = ' + JSON.stringify(this.captions, null, 2);
        const captionsJsFile = path__namespace.join(this.workDir.name, 'captions.js');
        fs.writeFileSync(captionsJsFile, captionsJs);
    }
}

class Recorder {
    captions;
    renderer;
    progressBar;
    browser = null;
    page = null;
    constructor(captions, renderer, progressBar) {
        this.captions = captions;
        this.renderer = renderer;
        this.progressBar = progressBar;
    }
    async recordCaptionsVideo(indexHtml) {
        this.progressBar.start(this.captions.length, 0);
        try {
            const videoElem = await this.launchBrowser(indexHtml);
            this.renderer.startEncoding();
            // Add empty frame before captions starts
            const beginningTime = this.captions[0].startTimeMs;
            this.renderer.addEmptyFrame(beginningTime);
            for (let i = 0; i < this.captions.length; i++) {
                const caption = this.captions[i];
                await this.nextStep();
                const screenShot = await this.takeScreenShot(videoElem);
                this.renderer.addFrame(caption, screenShot);
                // Add delay before the next frame
                if (i < this.captions.length - 1) {
                    const idleDelay = this.captions[i + 1].startTimeMs - caption.endTimeMs;
                    if (idleDelay) {
                        this.renderer.addEmptyFrame(idleDelay);
                    }
                }
                this.progressBar.increment();
            }
            // Finish with en empty frame
            this.renderer.addEmptyFrame();
            this.progressBar.stop();
            await this.renderer.render();
        }
        catch (error) {
            console.error('Error during Puppeteer operation:', error);
        }
        finally {
            await this.browser?.close();
        }
    }
    async launchBrowser(indexHtml) {
        this.browser = await puppeteer__namespace.launch({
            args: [
                '--disable-web-security', // Disable CORS
                '--allow-file-access-from-files', // Allow file access
            ],
            headless: true,
        });
        this.page = await this.browser.newPage();
        await this.page.goto(`file://${indexHtml}`);
        await this.page.evaluate(() => {
            return window.ready;
        });
        return this.page.$('#video');
    }
    async nextStep() {
        await this.page.evaluate(() => {
            window.Player.next();
        });
    }
    async takeScreenShot(elem) {
        const screenshotBuffer = await elem.screenshot({
            encoding: 'binary',
            omitBackground: true,
        });
        return pngjs.PNG.sync.read(Buffer.from(screenshotBuffer));
    }
}

class StatsPrinter {
    statsPrinted = false;
    print(stats) {
        const lines = Object
            .entries(stats)
            .map(([key, value]) => `${key}: ${value}`);
        if (this.statsPrinted) {
            process.stdout.write(`\x1b[${lines.length}A`); // Move up N lines
        }
        lines.forEach((line) => {
            process.stdout.write(`\r${line.padEnd(40)}\n`); // Ensure the line is fully overwritten
        });
        this.statsPrinted = true;
    }
}

class Renderer {
    args;
    workDir;
    framesFileName;
    emptyFrameFileName;
    constructor(args, workDir) {
        this.args = args;
        this.workDir = workDir;
        this.framesFileName = path__namespace.join(workDir.screenShotsDir, 'frames.txt');
        this.emptyFrameFileName = path__namespace.join(workDir.screenShotsDir, 'empty.png');
    }
    startEncoding() {
        const empty = new pngjs.PNG({
            width: this.args.videoWidth,
            height: this.args.videoHeight,
            colorType: 6,
        });
        fs.writeFileSync(this.emptyFrameFileName, pngjs.PNG.sync.write(empty));
    }
    addEmptyFrame(durationMs) {
        let frameDef = `file '${this.emptyFrameFileName}'\n`;
        if (durationMs) {
            const durationSec = durationMs / 1000;
            frameDef += `duration ${durationSec}\n`;
        }
        fs.appendFileSync(this.framesFileName, frameDef, 'utf8');
    }
    addFrame(caption, png) {
        const screenShotFileName = path__namespace.join(this.workDir.screenShotsDir, `screenshot_${caption.index}.png`);
        fs.writeFileSync(screenShotFileName, pngjs.PNG.sync.write(png));
        const durationSec = (caption.endTimeMs - caption.startTimeMs) / 1000;
        fs.appendFileSync(this.framesFileName, `file '${screenShotFileName}'\nduration ${durationSec}\n`, 'utf8');
    }
    async render() {
        console.log(`Encoding ${this.args.movOutputFile}...\n`);
        const statsPrinter = new StatsPrinter();
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(this.framesFileName)
                .inputOptions([
                '-f concat', // concat frames from the frame list
                '-safe 0' // to prevent errors related to unsafe filenames
            ])
                .outputOptions([
                '-c:v prores_ks', // codec for Films Apple QuickTime (MOV)
                '-profile:v 4444', // enable the best quality
                '-pix_fmt yuva444p10le', // lossless setting
                '-q:v 0', // lossless setting
                '-vendor ap10' // ensures the output MOV file is compatible with Apple QuickTime
            ])
                .output(this.args.movOutputFile)
                .on('progress', (progress) => {
                statsPrinter.print(progress);
            })
                .on('end', () => {
                console.log(`${this.args.movOutputFile} encoded`);
                resolve(this.args.movOutputFile);
            })
                .on('error', (err) => {
                reject(err);
            })
                .run();
        });
    }
}

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
    }
    catch (err) {
        console.error('Error occurred:', err);
    }
    finally {
        workDir.clear();
    }
})();
//# sourceMappingURL=index.js.map
