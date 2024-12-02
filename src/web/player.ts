import {Caption} from '../common/caption';
import {renderCaption} from './renderer';
import {Timeline} from './timeline';

interface Event {
    timeMs: number;
    toShow: HTMLDivElement[];
    toHide: HTMLDivElement[];
}

interface Events {
    [key: number]: Event;
}

export class Player {
    public onStop = () => {};

    private index = 0;
    private readonly captionsContainer: Element;
    private readonly rendered: HTMLDivElement[] = [];
    private timeline: Timeline | null = null;

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

        const eventTimeline: Events = {};

        for (let i = 0; i < this.captions.length; i++) {
            const caption = this.captions[i];

            eventTimeline[caption.startTimeMs] ||= {
                timeMs: caption.startTimeMs,
                toShow: [],
                toHide: [],
            }

            eventTimeline[caption.endTimeMs] ||= {
                timeMs: caption.endTimeMs,
                toShow: [],
                toHide: [],
            }

            const renderedIndex = i + 1;
            eventTimeline[caption.startTimeMs].toShow.push(this.rendered[renderedIndex]);
            eventTimeline[caption.endTimeMs].toHide.push(this.rendered[renderedIndex]);
        }

        this.timeline = new Timeline(this.onStop);

        for (const event of Object.values(eventTimeline) as Event[]) {
            this.timeline!.schedule(event.timeMs, () => {
                event.toHide.forEach(elem => elem.remove());
                event.toShow.forEach(elem => this.captionsContainer.appendChild(elem));
            });
        }

        this.timeline.run();
    }

    public stop() {
        this.timeline!.stop();
        this.rendered.forEach(elem => elem.remove());
        this.index = 0;
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
}