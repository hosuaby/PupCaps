(function (vue) {
    'use strict';

    class Player {
        videoElem;
        captions;
        cssProcessor;
        onStop = () => { };
        captionsContainer;
        rendered = [];
        timeoutIds = [];
        displayedCaptionId = 0;
        constructor(videoElem, captions, cssProcessor, renderer) {
            this.videoElem = videoElem;
            this.captions = captions;
            this.cssProcessor = cssProcessor;
            this.captionsContainer = this.videoElem.querySelector('.captions');
            for (const caption of captions) {
                this.rendered[caption.index] = renderer.renderCaption(caption);
            }
        }
        play() {
            this.rendered.forEach(captionElem => captionElem.remove());
            if (this.captions.length === 0) {
                return;
            }
            for (let i = 0; i < this.captions.length; i++) {
                const caption = this.captions[i];
                const displayTimeoutId = setTimeout(() => {
                    this.displayCaption(caption.index);
                }, caption.startTimeMs);
                let hideTimeoutId;
                if (i < this.captions.length - 1) {
                    hideTimeoutId = setTimeout(() => {
                        this.hideCaption(caption.index);
                    }, caption.endTimeMs);
                }
                else {
                    hideTimeoutId = setTimeout(() => {
                        this.hideCaption(caption.index);
                        this.stop();
                    }, caption.endTimeMs);
                }
                this.timeoutIds.push(displayTimeoutId, hideTimeoutId);
            }
        }
        stop() {
            if (this.displayedCaptionId) {
                this.rendered[this.displayedCaptionId].remove();
                this.displayedCaptionId = 0;
            }
            while (this.timeoutIds.length) {
                clearTimeout(this.timeoutIds.pop());
            }
            this.onStop();
        }
        prec() {
            if (!this.isBeginning) {
                let precId = this.displayedCaptionId - 1;
                if (precId) {
                    this.displayCaption(precId);
                }
                else {
                    this.hideCaption(this.displayedCaptionId);
                }
            }
        }
        next() {
            if (!this.isEnd) {
                this.displayCaption(this.displayedCaptionId + 1);
            }
        }
        get isBeginning() {
            return this.displayedCaptionId === 0;
        }
        get isEnd() {
            return this.displayedCaptionId === this.captions.length;
        }
        displayCaption(index) {
            if (this.displayedCaptionId === index) {
                return; // Displayed already, do nothing
            }
            if (this.displayedCaptionId) {
                this.rendered[this.displayedCaptionId].remove();
            }
            this.dynamicallyStyleContainers(index);
            this.captionsContainer.appendChild(this.rendered[index]);
            this.displayedCaptionId = index;
        }
        dynamicallyStyleContainers(index) {
            this.videoElem.setAttribute('class', '');
            this.captionsContainer.setAttribute('class', 'captions');
            const caption = this.captions[index - 1];
            const captionWords = caption.words.map(word => word.rawWord);
            this.cssProcessor.applyDynamicClasses(this.videoElem, index, caption.startTimeMs, captionWords);
            this.cssProcessor.applyDynamicClasses(this.captionsContainer, index, caption.startTimeMs, captionWords);
        }
        hideCaption(index) {
            if (this.displayedCaptionId != index) {
                return; // Removed already, do nothing
            }
            this.rendered[index].remove();
            this.displayedCaptionId = 0;
        }
    }

    const _hoisted_1 = {
        id: "player-controller",
        class: "section is-small"
    };
    const _hoisted_2 = { class: "field has-addons has-addons-centered" };
    const _hoisted_3 = { class: "control" };
    const _hoisted_4 = ["disabled"];
    const _hoisted_5 = { class: "control" };
    const _hoisted_6 = { class: "icon is-small" };
    const _hoisted_7 = { class: "control" };
    const _hoisted_8 = ["disabled"];
    var script = /*@__PURE__*/ vue.defineComponent({
        __name: 'player.component',
        setup(__props) {
            const playerState = vue.reactive({
                isPlaying: false,
                isBeginning: window.Player.isBeginning,
                isEnd: window.Player.isEnd,
            });
            window.Player.onStop = () => {
                playerState.isPlaying = false;
            };
            function prec() {
                window.Player.prec();
                updateState();
            }
            function next() {
                window.Player.next();
                updateState();
            }
            function togglePlay() {
                if (!playerState.isPlaying) {
                    window.Player.play();
                    playerState.isPlaying = true;
                }
                else {
                    window.Player.stop();
                }
            }
            function updateState() {
                playerState.isBeginning = window.Player.isBeginning;
                playerState.isEnd = window.Player.isEnd;
            }
            return (_ctx, _cache) => {
                return (vue.openBlock(), vue.createElementBlock("section", _hoisted_1, [
                    vue.createElementVNode("div", _hoisted_2, [
                        vue.createElementVNode("p", _hoisted_3, [
                            vue.createElementVNode("button", {
                                class: "button is-rounded",
                                disabled: playerState.isBeginning || playerState.isPlaying,
                                onClick: _cache[0] || (_cache[0] = ($event) => (prec()))
                            }, _cache[3] || (_cache[3] = [
                                vue.createElementVNode("span", { class: "icon is-small" }, [
                                    vue.createElementVNode("i", { class: "fa fa-backward" })
                                ], -1 /* HOISTED */),
                                vue.createElementVNode("span", null, "Prec", -1 /* HOISTED */)
                            ]), 8 /* PROPS */, _hoisted_4)
                        ]),
                        vue.createElementVNode("p", _hoisted_5, [
                            vue.createElementVNode("button", {
                                class: vue.normalizeClass(["button", [playerState.isPlaying ? 'is-danger' : 'is-primary']]),
                                onClick: _cache[1] || (_cache[1] = ($event) => (togglePlay()))
                            }, [
                                vue.createElementVNode("span", _hoisted_6, [
                                    vue.createElementVNode("i", {
                                        class: vue.normalizeClass(["fa", [playerState.isPlaying ? 'fa-stop' : 'fa-play']])
                                    }, null, 2 /* CLASS */)
                                ]),
                                _cache[4] || (_cache[4] = vue.createElementVNode("span", null, "Play", -1 /* HOISTED */))
                            ], 2 /* CLASS */)
                        ]),
                        vue.createElementVNode("p", _hoisted_7, [
                            vue.createElementVNode("button", {
                                class: "button is-rounded",
                                disabled: playerState.isEnd || playerState.isPlaying,
                                onClick: _cache[2] || (_cache[2] = ($event) => (next()))
                            }, _cache[5] || (_cache[5] = [
                                vue.createElementVNode("span", { class: "icon is-small" }, [
                                    vue.createElementVNode("i", { class: "fa fa-forward" })
                                ], -1 /* HOISTED */),
                                vue.createElementVNode("span", null, "Next", -1 /* HOISTED */)
                            ]), 8 /* PROPS */, _hoisted_8)
                        ])
                    ])
                ]));
            };
        }
    });

    script.__file = "src/web/components/player.component.vue";

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

    function normalizeTimecode(timecode) {
        const [hh, mm, ss, ms] = timecode.split(/[^\d]+/);
        return `${hh}:${mm}:${ss}.${ms}`;
    }
    class AbstractDynamicCssRule {
        targetSelectors;
        appliedCssClass;
        constructor(targetSelectors, appliedCssClass) {
            this.targetSelectors = targetSelectors;
            this.appliedCssClass = appliedCssClass;
        }
        isApplied(target, captionIndex, timeMs, words) {
            let targetClasses = target.getAttribute('class')?.split(' ') || [];
            for (const targetSelector of this.targetSelectors) {
                if (targetSelector.startsWith('#')) {
                    const idSelector = targetSelector.slice(1);
                    if (target.getAttribute('id') != idSelector) {
                        return false;
                    }
                }
                else if (targetSelector.startsWith('.')) {
                    const classSelector = targetSelector.slice(1);
                    if (!targetClasses.includes(classSelector)) {
                        return false;
                    }
                }
                else {
                    throw new Error(`Unsupported target selector: '${targetSelector}'`);
                }
            }
            return true;
        }
    }
    class IndexesDynamicCssRule extends AbstractDynamicCssRule {
        startIndexInclusive;
        endIndexInclusive;
        constructor(targetSelectors, appliedCssClass, startIndexInclusive, endIndexInclusive) {
            super(targetSelectors, appliedCssClass);
            this.startIndexInclusive = startIndexInclusive;
            this.endIndexInclusive = endIndexInclusive;
        }
        isApplied(target, captionIndex, timeMs, words) {
            return super.isApplied(target, captionIndex, timeMs, words)
                && this.startIndexInclusive <= captionIndex
                && (this.endIndexInclusive ? this.endIndexInclusive >= captionIndex : true);
        }
    }
    class TimecodesDynamicCssRule extends AbstractDynamicCssRule {
        startTimeMsInclusive;
        endTimeMsInclusive;
        constructor(targetSelectors, appliedCssClass, startTimeMsInclusive, endTimeMsInclusive) {
            super(targetSelectors, appliedCssClass);
            this.startTimeMsInclusive = startTimeMsInclusive;
            this.endTimeMsInclusive = endTimeMsInclusive;
        }
        isApplied(target, captionIndex, timeMs, words) {
            return super.isApplied(target, captionIndex, timeMs, words)
                && this.startTimeMsInclusive <= timeMs
                && (this.endTimeMsInclusive ? this.endTimeMsInclusive >= timeMs : true);
        }
    }
    function createDynamicCssRule(targetSelectors, filter) {
        switch (filter.type) {
            case 'indexes':
                const [startIndex, endIndex] = filter.args.map(arg => Number(arg));
                return new IndexesDynamicCssRule(targetSelectors, filter.cssClass, startIndex, endIndex);
            case 'timecodes':
                const [startMs, endMs] = filter.args.map(normalizeTimecode).map(toMillis);
                return new TimecodesDynamicCssRule(targetSelectors, filter.cssClass, startMs, endMs);
            default:
                throw new Error(`Unknown filter type '${filter.type}'!`);
        }
    }

    const dynamicCssClassPattern = /^\.pup-(\w+)((?:-[^-]+)+)$/;
    class CssProcessor {
        dynamicCssRules = [];
        constructor() {
            for (const styleSheet of document.styleSheets) {
                for (const styleRule of styleSheet.cssRules) {
                    const selectorText = styleRule.selectorText || '';
                    if (selectorText.includes('.pup-')) {
                        const selectors = CssProcessor.parseSelectors(selectorText);
                        const targetSelectors = [];
                        let filter = null;
                        for (const selector of selectors) {
                            if (selector.match(dynamicCssClassPattern)) {
                                if (filter) {
                                    throw new Error(`Only one dynamic CSS class is allowed per style rule. 
                                    Two dynamic classes were found: .${filter.cssClass} and ${selector}`);
                                }
                                filter = CssProcessor.parseFilter(selector);
                            }
                            else {
                                targetSelectors.push(selector);
                            }
                        }
                        const rule = createDynamicCssRule(targetSelectors, filter);
                        this.dynamicCssRules.push(rule);
                    }
                }
            }
        }
        applyDynamicClasses(target, captionIndex, timeMs, words) {
            const dynamicCssClasses = this.dynamicCssClasses(target, captionIndex, timeMs, words);
            let cssClass = target.getAttribute('class') || '';
            dynamicCssClasses.forEach(dynamicClass => cssClass += ' ' + dynamicClass);
            target.setAttribute('class', cssClass);
            return target;
        }
        dynamicCssClasses(target, captionIndex, timeMs, words) {
            return this.dynamicCssRules
                .filter(rule => rule.isApplied(target, captionIndex, timeMs, words))
                .map(rule => rule.appliedCssClass);
        }
        static parseFilter(dynamicCssClass) {
            const match = dynamicCssClass.match(dynamicCssClassPattern);
            if (!match) {
                throw new Error(`CSS class ${dynamicCssClass} do not match required pattern!`);
            }
            const cssClass = dynamicCssClass.slice(1);
            const filterType = match[1];
            const filterArgs = match[2].split('-').slice(1);
            return {
                cssClass,
                type: filterType,
                args: filterArgs,
            };
        }
        static parseSelectors(selectorText) {
            const selectors = [];
            let currentToken = '';
            let lastIsEscaped = false;
            for (let i = 0; i < selectorText.length; i++) {
                const char = selectorText[i];
                if ((char === '.' || char === '#') && !lastIsEscaped) {
                    if (currentToken) {
                        selectors.push(currentToken);
                    }
                    currentToken = char;
                }
                else if (char === '\\') {
                    currentToken += char;
                    lastIsEscaped = true;
                }
                else if (lastIsEscaped) {
                    currentToken += char;
                    lastIsEscaped = false;
                }
                else {
                    currentToken += char;
                }
            }
            if (currentToken) {
                selectors.push(currentToken);
            }
            return selectors;
        }
    }

    class CaptionRenderer {
        cssProcessor;
        constructor(cssProcessor) {
            this.cssProcessor = cssProcessor;
        }
        renderCaption(caption) {
            const captionDiv = document.createElement('div');
            captionDiv.setAttribute('id', `caption_${caption.index}`);
            captionDiv.setAttribute('class', 'caption');
            caption.words
                .map(word => this.renderWord(word, caption))
                .forEach(spanElem => captionDiv.appendChild(spanElem));
            const captionWords = caption.words.map(word => word.rawWord);
            return this.cssProcessor.applyDynamicClasses(captionDiv, caption.index, caption.startTimeMs, captionWords);
        }
        renderWord(word, caption) {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word.rawWord;
            let cssClass = 'word';
            if (word.isHighlighted) {
                cssClass += ' ' + (word.highlightClass || 'highlighted');
            }
            if (word.isBeforeHighlighted) {
                cssClass += ' before-highlighted';
            }
            if (word.isAfterHighlighted) {
                cssClass += ' after-highlighted';
            }
            wordSpan.setAttribute('class', cssClass);
            return this.cssProcessor.applyDynamicClasses(wordSpan, caption.index, caption.startTimeMs, [word.rawWord]);
        }
    }

    window.ready = new Promise((resolve, reject) => {
        window.onload = () => {
            const videoElem = document.getElementById('video');
            const cssProcessor = new CssProcessor();
            const renderer = new CaptionRenderer(cssProcessor);
            window.Player = new Player(videoElem, window.captions, cssProcessor, renderer);
            if (window.playerArgs.isPreview) {
                vue.createApp({})
                    .component('player', script)
                    .mount('#player-controller');
            }
            resolve();
        };
    });

})(Vue);
//# sourceMappingURL=index.js.map
