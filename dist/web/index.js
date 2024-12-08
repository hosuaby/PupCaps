(function (vue) {
    'use strict';

    function renderWord(word) {
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
        onStop = () => { };
        index = 0;
        captionsContainer;
        rendered = [];
        timeoutIds = [];
        displayedCaptionId = null;
        constructor(videoElem, captions) {
            this.videoElem = videoElem;
            this.captions = captions;
            this.captionsContainer = this.videoElem.querySelector('.captions');
            for (const caption of captions) {
                this.rendered[caption.index] = renderCaption(caption);
            }
        }
        play() {
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
                this.displayedCaptionId = null;
            }
            while (this.timeoutIds.length) {
                clearTimeout(this.timeoutIds.pop());
            }
            this.index = 0;
            this.onStop();
        }
        prec() {
            if (!this.isBeginning) {
                const oldCaptionElem = this.rendered[this.index];
                oldCaptionElem.remove();
                this.index--;
                if (!this.isBeginning) {
                    const newCaptionElem = this.rendered[this.index];
                    this.captionsContainer.appendChild(newCaptionElem);
                }
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
        get isBeginning() {
            return this.index === 0;
        }
        get isEnd() {
            return this.index === this.captions.length;
        }
        displayCaption(index) {
            if (this.displayedCaptionId === index) {
                return; // Displayed already, do nothing
            }
            if (this.displayedCaptionId) {
                this.rendered[this.displayedCaptionId].remove();
            }
            this.captionsContainer.appendChild(this.rendered[index]);
            this.displayedCaptionId = index;
        }
        hideCaption(index) {
            if (this.displayedCaptionId != index) {
                return; // Removed already, do nothing
            }
            this.rendered[index].remove();
            this.displayedCaptionId = null;
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

    window.ready = new Promise((resolve, reject) => {
        window.onload = () => {
            const videoElem = document.getElementById('video');
            window.Player = new Player(videoElem, window.captions);
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
