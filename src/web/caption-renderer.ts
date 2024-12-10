import {Caption, Word} from '../common/caption';
import {CssProcessor} from './css-processor';

export class CaptionRenderer {
    public constructor(private readonly cssProcessor: CssProcessor) {
    }

    public renderCaption(caption: Caption): HTMLDivElement {
        const captionDiv = document.createElement('div');
        captionDiv.setAttribute('id', `caption_${caption.index}`);
        captionDiv.setAttribute('class', 'caption');

        caption.words
            .map(word => this.renderWord(word, caption))
            .forEach(spanElem => captionDiv.appendChild(spanElem));

        const captionWords = caption.words.map(word => word.rawWord);
        return this.cssProcessor.applyDynamicClasses(captionDiv, caption.index, caption.startTimeMs, captionWords);
    }

    private renderWord(word: Word, caption: Caption): HTMLSpanElement {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word.rawWord;

        let cssClass = 'word'
        if (word.isHighlighted) {
            cssClass += ' ' + (word.highlightClass || 'highlighted');
        } if (word.isBeforeHighlighted) {
            cssClass += ' before-highlighted';
        } if (word.isAfterHighlighted) {
            cssClass += ' after-highlighted';
        }

        wordSpan.setAttribute('class', cssClass);

        return this.cssProcessor.applyDynamicClasses(wordSpan, caption.index, caption.startTimeMs, [ word.rawWord ]);
    }
}