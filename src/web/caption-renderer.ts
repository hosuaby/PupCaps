import {Caption, Word} from '../common/captions';
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
        const cssClasses = CaptionRenderer.wordSpanClasses(word);
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word.rawWord;
        wordSpan.classList.add(...cssClasses);

        return this.cssProcessor.applyDynamicClasses(wordSpan, caption.index, caption.startTimeMs, [ word.rawWord ]);
    }

    public static wordSpanClasses(word: Word): Set<string> {
        const cssClasses = new Set([ 'word' ]);

        if (word.isHighlighted) {
            cssClasses.add(word.highlightClass || 'highlighted');
        } if (word.isBeforeHighlighted) {
            cssClasses.add('before-highlighted');
        } if (word.isAfterHighlighted) {
            cssClasses.add('after-highlighted');
        }

        return cssClasses;
    }
}