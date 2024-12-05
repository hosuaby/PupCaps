(function (vue) {
    'use strict';

    function renderWord(word) {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word.rawWord;
        let cssClass = 'word';
        if (word.isHighlighted) {
            cssClass += ' highlighted';
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

    class Timeline {
        onEnd;
        tasks = [];
        timeoutId = null;
        constructor(onEnd) {
            this.onEnd = onEnd;
        }
        schedule(timeMs, task) {
            this.tasks.push({ timeMs, task });
        }
        run() {
            this.tasks.sort((a, b) => a.timeMs - b.timeMs);
            if (!this.tasks.length) {
                throw new Error('Event queue is empty!');
            }
            const first = this.tasks[0];
            this.timeoutId = setTimeout(() => this.exec(first.timeMs, 0), first.timeMs);
        }
        stop() {
            clearTimeout(this.timeoutId);
            this.onEnd();
        }
        exec(timeMs, index) {
            this.tasks[index].task();
            if (index < this.tasks.length - 1) {
                const next = this.tasks[index + 1];
                const timeout = next.timeMs - timeMs;
                this.timeoutId = setTimeout(() => this.exec(next.timeMs, index + 1), timeout);
            }
            else {
                this.onEnd();
            }
        }
    }

    class Player {
        videoElem;
        captions;
        onStop = () => { };
        index = 0;
        captionsContainer;
        rendered = [];
        timeline = null;
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
            const eventTimeline = {};
            for (let i = 0; i < this.captions.length; i++) {
                const caption = this.captions[i];
                eventTimeline[caption.startTimeMs] ||= {
                    timeMs: caption.startTimeMs,
                    toShow: [],
                    toHide: [],
                };
                eventTimeline[caption.endTimeMs] ||= {
                    timeMs: caption.endTimeMs,
                    toShow: [],
                    toHide: [],
                };
                const renderedIndex = i + 1;
                eventTimeline[caption.startTimeMs].toShow.push(this.rendered[renderedIndex]);
                eventTimeline[caption.endTimeMs].toHide.push(this.rendered[renderedIndex]);
            }
            this.timeline = new Timeline(this.onStop);
            for (const event of Object.values(eventTimeline)) {
                this.timeline.schedule(event.timeMs, () => {
                    event.toHide.forEach(elem => elem.remove());
                    event.toShow.forEach(elem => this.captionsContainer.appendChild(elem));
                });
            }
            this.timeline.run();
        }
        stop() {
            this.timeline.stop();
            this.rendered.forEach(elem => elem.remove());
            this.index = 0;
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
