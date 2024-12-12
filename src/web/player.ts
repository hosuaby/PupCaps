import {Caption} from '../common/caption';
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

        for (const caption of captions) {
            this.rendered[caption.index] = renderer.renderCaption(caption);
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

            let hideTimeoutId: NodeJS.Timeout;
            if (i < this.captions.length - 1) {
                hideTimeoutId = setTimeout(() => {
                    this.hideCaption(caption.index);
                }, caption.endTimeMs);
            } else {
                hideTimeoutId = setTimeout(() => {
                    this.hideCaption(caption.index);
                    this.stop();
                }, caption.endTimeMs);
            }

            this.timeoutIds.push(displayTimeoutId, hideTimeoutId);
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
            this.rendered[this.displayedCaptionId].remove();
        }

        this.dynamicallyStyleContainers(index);

        this.captionsContainer.appendChild(this.rendered[index]);
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