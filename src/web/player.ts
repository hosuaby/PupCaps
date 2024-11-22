import {Caption} from '../common/caption';
import {renderCaption} from './renderer';

export class Player {
    private index = 0;
    private readonly captionsContainer: Element;
    private readonly rendered: HTMLDivElement[] = [];

    constructor(private readonly videoElem: HTMLElement,
                private readonly captions: Caption[]) {
        this.captionsContainer = this.videoElem.querySelector('.captions')!;

        for (const caption of captions) {
            this.rendered[caption.index] = renderCaption(caption);
        }
    }

    next() {
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

    get isEnd(): boolean {
        return this.index === this.captions.length
    }
}