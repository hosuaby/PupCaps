(function () {
    'use strict';

    function renderWord(word) {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word.rawWord;
        let cssClass = 'word';
        if (word.isHighlighted) {
            cssClass += ' highlighted';
        }
        wordSpan.setAttribute('class', cssClass);
        return wordSpan;
    }
    function renderCaption(caption) {
        const captionDiv = document.createElement('div');
        captionDiv.setAttribute('id', `caption_${caption.index}`);
        captionDiv.setAttribute('class', 'caption');
        caption.words
            .map(renderWord)
            .forEach(spanElem => captionDiv.appendChild(spanElem));
        return captionDiv;
    }

    class Player {
        videoElem;
        captions;
        index = 0;
        captionsContainer;
        rendered = [];
        constructor(videoElem, captions) {
            this.videoElem = videoElem;
            this.captions = captions;
            this.captionsContainer = this.videoElem.querySelector('.captions');
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
                const newCaptionElem = this.rendered[this.index];
                this.captionsContainer.appendChild(newCaptionElem);
            }
        }
        get isEnd() {
            return this.index === this.captions.length;
        }
    }

    window.ready = new Promise((resolve, reject) => {
        window.onload = () => {
            const videoElem = document.getElementById('video');
            window.Player = new Player(videoElem, window.captions);
            resolve();
        };
    });

})();
//# sourceMappingURL=index.js.map
