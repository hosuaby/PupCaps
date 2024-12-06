import {Caption} from '../common/caption';
import {renderCaption} from './renderer';

export class Player {
    public onStop = () => {};

    private index = 0;
    private readonly captionsContainer: Element;
    private readonly rendered: HTMLDivElement[] = [];
    private timeoutIds: NodeJS.Timeout[] = [];
    private displayedCaptionId: number | null = null;

    constructor(private readonly videoElem: HTMLElement,
                private readonly captions: Caption[]) {
        this.captionsContainer = this.videoElem.querySelector('.captions')!;

        for (const caption of captions) {
            this.rendered[caption.index] = renderCaption(caption);
        }
    }

    public play() {
        this.index = 0;
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
            this.displayedCaptionId = null;
        }

        while (this.timeoutIds.length) {
            clearTimeout(this.timeoutIds.pop());
        }

        this.index = 0;
        this.onStop();
    }

    public prec() {
        if (!this.isBeginning) {
            const oldCaptionElem = this.rendered[this.index];
            oldCaptionElem.remove();
            this.index--;

            if (!this.isBeginning) {
                const newCaptionElem = this.rendered[this.index]
                this.captionsContainer.appendChild(newCaptionElem);
            }
        }
    }

    public next() {
        if (!this.isEnd) {
            if (this.index) {
                const oldCaptionElem = this.rendered[this.index];
                oldCaptionElem.remove();
            }

            this.index++;
            const newCaptionElem = this.rendered[this.index]
            this.captionsContainer.appendChild(newCaptionElem);
        }
    }

    public get isBeginning(): boolean {
        return this.index === 0;
    }

    public get isEnd(): boolean {
        return this.index === this.captions.length
    }

    private displayCaption(index: number) {
        if (this.displayedCaptionId === index) {
            return;     // Displayed already, do nothing
        }

        if (this.displayedCaptionId) {
            this.rendered[this.displayedCaptionId].remove();
        }

        this.captionsContainer.appendChild(this.rendered[index]);
        this.displayedCaptionId = index;
    }

    private hideCaption(index: number) {
        if (this.displayedCaptionId != index) {
            return;     // Removed already, do nothing
        }

        this.rendered[index].remove();
        this.displayedCaptionId = null;
    }
}