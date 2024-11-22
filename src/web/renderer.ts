import {Caption, Word} from '../common/caption';

function renderWord(word: Word): HTMLSpanElement {
    const wordSpan = document.createElement('span');
    wordSpan.textContent = word.rawWord;

    let cssClass = 'word'
    if (word.isHighlighted) {
        cssClass += ' highlighted';
    }

    wordSpan.setAttribute('class', cssClass);

    return wordSpan;
}

export function renderCaption(caption: Caption): HTMLDivElement {
    const captionDiv = document.createElement('div');
    captionDiv.setAttribute('id', `caption_${caption.index}`);
    captionDiv.setAttribute('class', 'caption');

    caption.words
        .map(renderWord)
        .forEach(spanElem => captionDiv.appendChild(spanElem));

    return captionDiv;
}