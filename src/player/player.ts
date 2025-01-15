import {Caption, haveSameWords} from '../common/captions';
import {CaptionRenderer} from './caption-renderer';
import {CssProcessor} from './css-processor';

export class Player {
    public onStop = () => {};

    private readonly captionsContainer: HTMLDivElement;
    private readonly rendered: HTMLDivElement[] = [];
    private timeoutIds: NodeJS.Timeout[] = [];
    private displayedCaptionId = 0;

    constructor(private readonly videoElem: HTMLElement,
                private readonly captions: Caption[],
                private readonly cssProcessor: CssProcessor,
                renderer: CaptionRenderer) {
        this.captionsContainer = this.videoElem.querySelector('.captions')!;

        for (let i = 0; i < captions.length; i++) {
            const caption = captions[i];
            this.rendered[caption.index] = i > 0 && haveSameWords(caption, captions[i - 1])
                ? this.rendered[caption.index - 1]
                : renderer.renderCaption(caption);
        }
    }

    public play() {
        this.rendered.forEach(captionElem => captionElem.remove());

        if (this.captions.length === 0) {
            return;
        }

        for (let i = 0; i < this.captions.length; i++) {
            const caption = this.captions[i];
            const displayTimeoutId = setTimeout(() => {
                this.displayCaption(caption.index);
            }, caption.startTimeMs);
            this.timeoutIds.push(displayTimeoutId);

            if (i < this.captions.length - 1) {
                const nextCaption = this.captions[i + 1];

                if (!haveSameWords(caption, nextCaption)) {
                    const hideTimeoutId = setTimeout(() => {
                        this.hideCaption(caption.index);
                    }, caption.endTimeMs);
                    this.timeoutIds.push(hideTimeoutId);
                }
            } else {
                const hideTimeoutId = setTimeout(() => {
                    this.hideCaption(caption.index);
                    this.stop();
                }, caption.endTimeMs);
                this.timeoutIds.push(hideTimeoutId);
            }
        }
    }

    public stop() {
        if (this.displayedCaptionId) {
            this.rendered[this.displayedCaptionId].remove();
            this.displayedCaptionId = 0;
        }

        while (this.timeoutIds.length) {
            clearTimeout(this.timeoutIds.pop());
        }

        this.onStop();
    }

    public prec() {
        if (!this.isBeginning) {
            let precId = this.displayedCaptionId - 1;
            if (precId) {
                this.displayCaption(precId);
            } else {
                this.hideCaption(this.displayedCaptionId)
            }
        }
    }

    public next() {
        if (!this.isEnd) {
            this.displayCaption(this.displayedCaptionId + 1);
        }
    }

    public get isBeginning(): boolean {
        return this.displayedCaptionId === 0;
    }

    public get isEnd(): boolean {
        return this.displayedCaptionId === this.captions.length
    }

    private displayCaption(index: number) {
        if (this.displayedCaptionId === index) {
            return;     // Displayed already, do nothing
        }

        if (this.displayedCaptionId) {
            const displayedCaption = this.captions[this.displayedCaptionId - 1];
            const nextCaption = this.captions[index - 1];

            if (haveSameWords(displayedCaption, nextCaption)) {
                const renderedCaption = this.rendered[this.displayedCaptionId];

                const captionWords = nextCaption.words.map(word => word.rawWord);
                this.cssProcessor.applyDynamicClasses(renderedCaption, index, nextCaption.startTimeMs, captionWords);

                const renderedWords = renderedCaption.querySelectorAll('.word');
                for (let i = 0; i < renderedWords.length; i++) {
                    const word = nextCaption.words[i];
                    const renderedWord = renderedWords[i] as HTMLElement;

                    const cssClasses = CaptionRenderer.wordSpanClasses(word);
                    const existingClasses = new Set([...renderedWord.classList.values()]);

                    const classesToRemove = existingClasses.difference(cssClasses);
                    const classesToAdd = cssClasses.difference(existingClasses);

                    renderedWord.classList.remove(...classesToRemove);
                    renderedWord.classList.add(...classesToAdd);

                    this.cssProcessor.applyDynamicClasses(renderedWord, index, nextCaption.startTimeMs, [ word.rawWord ]);
                }
            } else {
                this.rendered[this.displayedCaptionId].remove();
                this.captionsContainer.appendChild(this.rendered[index]);
            }
        } else {
            this.captionsContainer.appendChild(this.rendered[index]);
        }

        this.dynamicallyStyleContainers(index);
        this.displayedCaptionId = index;
    }

    private dynamicallyStyleContainers(index: number) {
        this.videoElem.setAttribute('class', '');
        this.captionsContainer.setAttribute('class', 'captions');

        const caption = this.captions[index - 1];
        const captionWords = caption.words.map(word => word.rawWord);
        this.cssProcessor.applyDynamicClasses(this.videoElem, index, caption.startTimeMs, captionWords);
        this.cssProcessor.applyDynamicClasses(this.captionsContainer, index, caption.startTimeMs, captionWords);
    }

    private hideCaption(index: number) {
        if (this.displayedCaptionId != index) {
            return;     // Removed already, do nothing
        }

        this.rendered[index].remove();
        this.displayedCaptionId = 0;
    }
}