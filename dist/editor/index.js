(function (vue) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var FileSaver_min$1 = {exports: {}};

	var FileSaver_min = FileSaver_min$1.exports;

	var hasRequiredFileSaver_min;

	function requireFileSaver_min () {
		if (hasRequiredFileSaver_min) return FileSaver_min$1.exports;
		hasRequiredFileSaver_min = 1;
		(function (module, exports) {
			(function(a,b){b();})(FileSaver_min,function(){function b(a,b){return "undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c);},d.onerror=function(){console.error("could not download file");},d.send();}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send();}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"));}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b);}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof commonjsGlobal&&commonjsGlobal.global===commonjsGlobal?commonjsGlobal:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href);},4E4),setTimeout(function(){e(j);},0));}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else {var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i);});}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null;},k.readAsDataURL(b);}else {var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m);},4E4);}});f.saveAs=g.saveAs=g,(module.exports=g);});

			
		} (FileSaver_min$1));
		return FileSaver_min$1.exports;
	}

	var FileSaver_minExports = requireFileSaver_min();

	const _hoisted_1$4 = { class: "file has-name" };
	const _hoisted_2$2 = { class: "file-label" };
	const _hoisted_3$1 = { class: "file-name is-fullwidth" };
	var script$6 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'srt-file-picker.component',
	    emits: ["file-selected"],
	    setup(__props, { emit: __emit }) {
	        const emit = __emit;
	        const selectedFile = vue.ref();
	        function onFileSelected(event) {
	            const file = event.target.files?.[0];
	            if (file) {
	                selectedFile.value = file;
	                emit('file-selected', file);
	            }
	        }
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
	                vue.createElementVNode("label", _hoisted_2$2, [
	                    vue.createElementVNode("input", {
	                        name: "srt_file",
	                        class: "file-input",
	                        type: "file",
	                        accept: ".srt",
	                        onChange: onFileSelected
	                    }, null, 32 /* NEED_HYDRATION */),
	                    _cache[0] || (_cache[0] = vue.createElementVNode("span", { class: "file-cta" }, [
	                        vue.createElementVNode("span", { class: "file-icon" }, [
	                            vue.createElementVNode("i", { class: "fa fa-upload" })
	                        ]),
	                        vue.createElementVNode("span", { class: "file-label" }, "Pick subs file")
	                    ], -1 /* HOISTED */)),
	                    vue.createElementVNode("span", _hoisted_3$1, vue.toDisplayString(selectedFile.value?.name), 1 /* TEXT */)
	                ])
	            ]));
	        };
	    }
	});

	script$6.__file = "src/editor/components/srt-file-picker.component.vue";

	async function loadFile(file) {
	    const reader = new FileReader();
	    return new Promise((resolve, reject) => {
	        reader.onload = (loadEvent) => {
	            resolve(loadEvent.target?.result);
	        };
	        reader.onerror = (err) => {
	            reject(err);
	        };
	        reader.readAsText(file);
	    });
	}

	class Timecode {
	    hours;
	    minutes;
	    seconds;
	    millis;
	    constructor(millis) {
	        this.millis = millis % 1000;
	        this.hours = Math.floor(millis / 3_600_000);
	        const remainingMillisAfterHours = millis % 3_600_000;
	        this.minutes = Math.floor(remainingMillisAfterHours / 60_000);
	        const remainingMillisAfterMinutes = remainingMillisAfterHours % 60_000;
	        this.seconds = Math.floor(remainingMillisAfterMinutes / 1000);
	    }
	    get hh() {
	        return String(this.hours).padStart(2, '0');
	    }
	    get mm() {
	        return String(this.minutes).padStart(2, '0');
	    }
	    get ss() {
	        return String(this.seconds).padStart(2, '0');
	    }
	    get SSS() {
	        return String(this.millis).padStart(3, '0');
	    }
	    get asString() {
	        return `${this.hh}:${this.mm}:${this.ss},${this.SSS}`;
	    }
	}
	function toMillis(timecodes) {
	    const parts = timecodes.split(/[:,]/).map(Number);
	    const hours = parts[0];
	    const minutes = parts[1];
	    const seconds = parts[2];
	    const milliseconds = parts[3];
	    return hours * 3_600_000 // hours to millis
	        + minutes * 60_000 // minutes to millis
	        + seconds * 1000 // second to millis
	        + milliseconds;
	}

	const indexLinePattern = /^\d+$/;
	const timecodesLinePattern = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/;
	const highlightedWordPattern = /^\[(.+)](?:\((\w+)\))?$/;
	function haveSameWords(caption1, caption2) {
	    if (caption1.words.length != caption2.words.length) {
	        return false;
	    }
	    for (let i = 0; i < caption1.words.length; i++) {
	        if (caption1.words[i].rawWord != caption2.words[i].rawWord) {
	            return false;
	        }
	    }
	    return true;
	}
	function readCaptions(srtContent) {
	    const lines = srtContent.split('\n');
	    const captions = [];
	    let index = 0;
	    let timecodesStart = null;
	    let timecodesEnd = null;
	    for (const line of lines) {
	        let match;
	        if ((match = line.match(indexLinePattern))) {
	            index = Number(line);
	        }
	        else if ((match = line.match(timecodesLinePattern))) {
	            timecodesStart = match[1];
	            timecodesEnd = match[2];
	        }
	        else if (line.length) {
	            const start = toMillis(timecodesStart);
	            const end = toMillis(timecodesEnd);
	            const words = readWords(line);
	            captions.push({
	                index,
	                words,
	                startTimeMs: start,
	                endTimeMs: end,
	            });
	        }
	    }
	    return captions;
	}
	function readWords(text) {
	    const words = splitText(text);
	    const highlightedIndex = words.findIndex(word => word.match(highlightedWordPattern));
	    const res = [];
	    for (let i = 0; i < words.length; i++) {
	        const word = words[i];
	        const match = word.match(highlightedWordPattern);
	        const rawWord = match ? match[1] : word;
	        const highlightClass = match && match[2] ? match[2] : null;
	        const isHighlighted = Boolean(match);
	        const isBeforeHighlighted = Boolean(~highlightedIndex && !isHighlighted && i < highlightedIndex);
	        const isAfterHighlighted = Boolean(~highlightedIndex && !isHighlighted && i > highlightedIndex);
	        const wordObject = {
	            rawWord,
	            isHighlighted,
	            isBeforeHighlighted,
	            isAfterHighlighted,
	        };
	        if (highlightClass) {
	            wordObject.highlightClass = highlightClass;
	        }
	        res.push(wordObject);
	    }
	    return res;
	}
	function splitText(text) {
	    const words = [];
	    let currentWord = '';
	    let isCurrentHighlighted = false;
	    for (let i = 0; i < text.length; i++) {
	        const char = text[i];
	        const isWhitespace = /^\s$/.test(char);
	        const isPunctuation = /[,.!?]/.test(char);
	        if (!isWhitespace) {
	            if (!isPunctuation) {
	                currentWord += char;
	                switch (char) {
	                    case '[':
	                    case '(':
	                        isCurrentHighlighted = true;
	                        break;
	                    case ']':
	                    case ')':
	                        isCurrentHighlighted = false;
	                        break;
	                }
	            }
	            else {
	                if (currentWord) {
	                    currentWord += char;
	                }
	                else {
	                    // Attach punctuation mark to the previous word
	                    words[words.length - 1] += ' ' + char;
	                }
	            }
	        }
	        else {
	            // char is a whitespace
	            if (isCurrentHighlighted) {
	                currentWord += char;
	            }
	            else if (currentWord) {
	                words.push(currentWord);
	                currentWord = '';
	            }
	        }
	    }
	    if (currentWord) {
	        words.push(currentWord);
	    }
	    return words;
	}

	class KaraokeGroup {
	    indexStart;
	    indexEnd;
	    words;
	    constructor(indexStart, indexEnd, words) {
	        this.indexStart = indexStart;
	        this.indexEnd = indexEnd;
	        this.words = words;
	    }
	    static fromCaptions(captions) {
	        const indexStart = captions[0].index;
	        const indexEnd = captions[captions.length - 1].index;
	        const words = captions
	            .map(caption => {
	            const highlightedWord = caption.words.filter(word => word.isHighlighted)[0].rawWord;
	            return {
	                rawWord: highlightedWord,
	                startTimeMs: caption.startTimeMs,
	                endTimeMs: caption.endTimeMs,
	            };
	        });
	        return new KaraokeGroup(indexStart, indexEnd, words);
	    }
	    addAtBeginning(word) {
	        this.indexStart--;
	        this.words.unshift(word);
	    }
	    removeFromBeginning() {
	        this.indexStart++;
	        return this.words.splice(0, 1)[0];
	    }
	    addAtEnd(word) {
	        this.indexEnd++;
	        this.words.push(word);
	    }
	    removeFromEnd() {
	        this.indexEnd--;
	        return this.words.pop();
	    }
	    get id() {
	        return `${this.indexStart}-${this.indexEnd}`;
	    }
	    get startTimeMs() {
	        return this.words[0].startTimeMs;
	    }
	    get endTimeMs() {
	        return this.words[this.words.length - 1].endTimeMs;
	    }
	    get isEmpty() {
	        return this.words.length === 0;
	    }
	}
	class CaptionsService {
	    groups = [];
	    readCaptions(captions) {
	        this.groups = [];
	        let lastCaption = null;
	        let lastGroup = [];
	        for (const caption of captions) {
	            if (lastCaption && !haveSameWords(caption, lastCaption)) {
	                const karaokeGroup = KaraokeGroup.fromCaptions(lastGroup);
	                this.groups.push(karaokeGroup);
	                lastGroup = [];
	            }
	            lastGroup.push(caption);
	            lastCaption = caption;
	        }
	        if (lastGroup.length) {
	            const karaokeGroup = KaraokeGroup.fromCaptions(lastGroup);
	            this.groups.push(karaokeGroup);
	        }
	        console.dir(this.groups, { depth: null });
	    }
	    moveFirstWordToPrecedentGroup(groupId) {
	        const karaokeGroup = this.groups[groupId];
	        const firstWord = karaokeGroup.removeFromBeginning();
	        if (groupId > 0) {
	            this.groups[groupId - 1].addAtEnd(firstWord);
	        }
	        else {
	            const index = karaokeGroup.indexStart - 1;
	            const newKaraokeGroup = new KaraokeGroup(index, index, [firstWord]);
	            this.groups.unshift(newKaraokeGroup);
	        }
	        if (karaokeGroup.isEmpty) {
	            this.groups.splice(groupId, 1);
	        }
	    }
	    moveLastWordToNextGroup(groupId) {
	        const karaokeGroup = this.groups[groupId];
	        const lastWord = karaokeGroup.removeFromEnd();
	        if (groupId < this.groups.length - 1) {
	            this.groups[groupId + 1].addAtBeginning(lastWord);
	        }
	        else {
	            const index = karaokeGroup.indexEnd + 1;
	            const newKaraokeGroup = new KaraokeGroup(index, index, [lastWord]);
	            this.groups.push(newKaraokeGroup);
	        }
	        if (karaokeGroup.isEmpty) {
	            this.groups.splice(groupId, 1);
	        }
	    }
	    get karaokeGroups() {
	        return [...this.groups];
	    }
	    get asSrt() {
	        let srtText = '';
	        for (const group of this.groups) {
	            for (let i = 0; i < group.words.length; i++) {
	                const captionIndex = group.indexStart + i;
	                const highlightedWord = group.words[i];
	                const startTimecode = new Timecode(highlightedWord.startTimeMs).asString;
	                const endTimecode = new Timecode(highlightedWord.endTimeMs).asString;
	                let captionWords = '';
	                for (let j = 0; j < group.words.length; j++) {
	                    const word = group.words[j];
	                    captionWords += j === i
	                        ? `[${word.rawWord}] `
	                        : `${word.rawWord} `;
	                }
	                srtText += `${captionIndex}\n${startTimecode} --> ${endTimecode}\n${captionWords}\n\n`;
	            }
	        }
	        return srtText;
	    }
	}

	var script$5 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'indexes.component',
	    props: {
	        karaokeGroup: { type: null, required: true }
	    },
	    setup(__props) {
	        const props = __props;
	        const karaokeGroup = props.karaokeGroup;
	        const start = karaokeGroup.indexStart;
	        const end = karaokeGroup.indexEnd;
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
	                vue.createElementVNode("strong", null, vue.toDisplayString(vue.unref(start)), 1 /* TEXT */),
	                (vue.unref(start) !== vue.unref(end))
	                    ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
	                        _cache[0] || (_cache[0] = vue.createElementVNode("i", { class: "fas fa-arrow-right" }, null, -1 /* HOISTED */)),
	                        vue.createElementVNode("strong", null, vue.toDisplayString(vue.unref(end)), 1 /* TEXT */)
	                    ], 64 /* STABLE_FRAGMENT */))
	                    : vue.createCommentVNode("v-if", true)
	            ], 64 /* STABLE_FRAGMENT */));
	        };
	    }
	});

	script$5.__file = "src/editor/components/indexes.component.vue";

	const _hoisted_1$3 = { class: "tags has-addons" };
	var script$4 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'timecode.component',
	    props: {
	        timecode: { type: null, required: true },
	        hoursChanged: { type: Boolean, required: false },
	        minutesChanged: { type: Boolean, required: false },
	        secondsChanged: { type: Boolean, required: false },
	        millisChanged: { type: Boolean, required: false }
	    },
	    setup(__props) {
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
	                vue.createElementVNode("span", {
	                    class: vue.normalizeClass(["tag", { 'is-warning': _ctx.hoursChanged }])
	                }, vue.toDisplayString(_ctx.timecode.hh), 3 /* TEXT, CLASS */),
	                _cache[0] || (_cache[0] = vue.createElementVNode("span", null, ":", -1 /* HOISTED */)),
	                vue.createElementVNode("span", {
	                    class: vue.normalizeClass(["tag", { 'is-warning': _ctx.minutesChanged }])
	                }, vue.toDisplayString(_ctx.timecode.mm), 3 /* TEXT, CLASS */),
	                _cache[1] || (_cache[1] = vue.createElementVNode("span", null, ":", -1 /* HOISTED */)),
	                vue.createElementVNode("span", {
	                    class: vue.normalizeClass(["tag", { 'is-warning': _ctx.secondsChanged }])
	                }, vue.toDisplayString(_ctx.timecode.ss), 3 /* TEXT, CLASS */),
	                _cache[2] || (_cache[2] = vue.createElementVNode("span", null, ",", -1 /* HOISTED */)),
	                vue.createElementVNode("span", {
	                    class: vue.normalizeClass(["tag", { 'is-warning': _ctx.millisChanged }])
	                }, vue.toDisplayString(_ctx.timecode.SSS), 3 /* TEXT, CLASS */)
	            ]));
	        };
	    }
	});

	script$4.__file = "src/editor/components/timecode.component.vue";

	const _hoisted_1$2 = { class: "buttons has-addons is-inline-block" };
	const _hoisted_2$1 = ["onClick"];
	const _hoisted_3 = { class: "button is-small is-rounded" };
	const _hoisted_4 = ["onClick"];
	var script$3 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'words.component',
	    props: {
	        karaokeGroup: { type: null, required: true }
	    },
	    emits: ["move-word-to-prec", "move-word-to-next"],
	    setup(__props) {
	        const props = __props;
	        const karaokeGroup = props.karaokeGroup;
	        return (_ctx, _cache) => {
	            return (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(karaokeGroup).words, (word, index) => {
	                return (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$2, [
	                    (vue.unref(karaokeGroup).indexStart > 1 && index === 0)
	                        ? (vue.openBlock(), vue.createElementBlock("button", {
	                            key: 0,
	                            onClick: ($event) => (_ctx.$emit('move-word-to-prec', word)),
	                            class: "button is-small is-rounded is-info"
	                        }, [...(_cache[0] || (_cache[0] = [
	                                vue.createElementVNode("span", { class: "icon is-small" }, [
	                                    vue.createElementVNode("i", { class: "fas fa-chevron-left" })
	                                ], -1 /* HOISTED */)
	                            ]))], 8 /* PROPS */, _hoisted_2$1))
	                        : vue.createCommentVNode("v-if", true),
	                    vue.createElementVNode("button", _hoisted_3, vue.toDisplayString(word.rawWord), 1 /* TEXT */),
	                    (index === vue.unref(karaokeGroup).words.length - 1)
	                        ? (vue.openBlock(), vue.createElementBlock("button", {
	                            key: 1,
	                            onClick: ($event) => (_ctx.$emit('move-word-to-next', word)),
	                            class: "button is-small is-rounded is-info"
	                        }, [...(_cache[1] || (_cache[1] = [
	                                vue.createElementVNode("span", { class: "icon is-small" }, [
	                                    vue.createElementVNode("i", { class: "fas fa-chevron-right" })
	                                ], -1 /* HOISTED */)
	                            ]))], 8 /* PROPS */, _hoisted_4))
	                        : vue.createCommentVNode("v-if", true)
	                ]));
	            }), 256 /* UNKEYED_FRAGMENT */));
	        };
	    }
	});

	script$3.__file = "src/editor/components/words.component.vue";

	var script$2 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'cue.component',
	    props: {
	        karaokeGroup: { type: null, required: true }
	    },
	    emits: ["move-word-to-prec", "move-word-to-next"],
	    setup(__props) {
	        const props = __props;
	        const timecodeStart = new Timecode(props.karaokeGroup.startTimeMs);
	        const timecodeEnd = new Timecode(props.karaokeGroup.endTimeMs);
	        const hoursChanged = timecodeStart.hours !== timecodeEnd.hours;
	        const minutesChanged = timecodeStart.minutes !== timecodeEnd.minutes;
	        const secondsChanged = timecodeStart.seconds !== timecodeEnd.seconds;
	        const millisChanged = timecodeStart.millis !== timecodeEnd.millis;
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock("tr", null, [
	                vue.createElementVNode("td", null, [
	                    vue.createVNode(script$5, vue.normalizeProps(vue.guardReactiveProps({ karaokeGroup: _ctx.karaokeGroup })), null, 16 /* FULL_PROPS */)
	                ]),
	                vue.createElementVNode("td", null, [
	                    vue.createVNode(script$4, {
	                        timecode: vue.unref(timecodeStart),
	                        "hours-changed": hoursChanged,
	                        "minutes-changed": minutesChanged,
	                        "seconds-changed": secondsChanged,
	                        "millis-changed": millisChanged
	                    }, null, 8 /* PROPS */, ["timecode"])
	                ]),
	                vue.createElementVNode("td", null, [
	                    vue.createVNode(script$4, {
	                        timecode: vue.unref(timecodeEnd),
	                        "hours-changed": hoursChanged,
	                        "minutes-changed": minutesChanged,
	                        "seconds-changed": secondsChanged,
	                        "millis-changed": millisChanged
	                    }, null, 8 /* PROPS */, ["timecode"])
	                ]),
	                vue.createElementVNode("td", null, [
	                    vue.createVNode(script$3, {
	                        "karaoke-group": props.karaokeGroup,
	                        onMoveWordToPrec: _cache[0] || (_cache[0] = ($event) => (_ctx.$emit('move-word-to-prec', $event))),
	                        onMoveWordToNext: _cache[1] || (_cache[1] = ($event) => (_ctx.$emit('move-word-to-next', $event)))
	                    }, null, 8 /* PROPS */, ["karaoke-group"])
	                ])
	            ]));
	        };
	    }
	});

	script$2.__file = "src/editor/components/cue.component.vue";

	const _hoisted_1$1 = { class: "table is-fullwidth is-hoverable" };
	var script$1 = /*@__PURE__*/ vue.defineComponent({
	    __name: 'subtitles-table.component',
	    props: {
	        karaokeGroups: { type: Array, required: true }
	    },
	    setup(__props) {
	        const props = __props;
	        const captionService = vue.inject('captionService');
	        const groups = vue.ref(props.karaokeGroups);
	        vue.watch(() => props.karaokeGroups, (newValue) => {
	            groups.value = newValue;
	        });
	        function moveFirstWordToPrecedentGroup(groupId) {
	            captionService.moveFirstWordToPrecedentGroup(groupId);
	            groups.value = captionService.karaokeGroups;
	        }
	        function moveLastWordToNextGroup(groupId) {
	            captionService.moveLastWordToNextGroup(groupId);
	            groups.value = captionService.karaokeGroups;
	        }
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock("table", _hoisted_1$1, [
	                _cache[0] || (_cache[0] = vue.createElementVNode("thead", null, [
	                    vue.createElementVNode("tr", { class: "is-link" }, [
	                        vue.createElementVNode("th", {
	                            class: "has-text-white",
	                            style: { "width": "5%" }
	                        }, "Indexes"),
	                        vue.createElementVNode("th", {
	                            class: "has-text-white",
	                            style: { "width": "15%" }
	                        }, "Start"),
	                        vue.createElementVNode("th", {
	                            class: "has-text-white",
	                            style: { "width": "15%" }
	                        }, "End"),
	                        vue.createElementVNode("th", { class: "has-text-white" }, " Caption")
	                    ])
	                ], -1 /* HOISTED */)),
	                vue.createElementVNode("tbody", null, [
	                    (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(groups.value, (karaokeGroup, index) => {
	                        return (vue.openBlock(), vue.createBlock(script$2, {
	                            key: karaokeGroup.id,
	                            "karaoke-group": karaokeGroup,
	                            onMoveWordToPrec: ($event) => (moveFirstWordToPrecedentGroup(index)),
	                            onMoveWordToNext: ($event) => (moveLastWordToNextGroup(index))
	                        }, null, 8 /* PROPS */, ["karaoke-group", "onMoveWordToPrec", "onMoveWordToNext"]));
	                    }), 128 /* KEYED_FRAGMENT */))
	                ])
	            ]));
	        };
	    }
	});

	script$1.__file = "src/editor/components/subtitles-table.component.vue";

	const _hoisted_1 = { class: "box" };
	const _hoisted_2 = ["disabled"];
	var script = /*@__PURE__*/ vue.defineComponent({
	    __name: 'application.component',
	    setup(__props) {
	        const captionService = new CaptionsService();
	        vue.provide('captionService', captionService);
	        const karaokeGroups = vue.ref([]);
	        const downloadEnabled = vue.ref(false);
	        async function onFileSelected(file) {
	            const content = await loadFile(file);
	            const captions = readCaptions(content);
	            captionService.readCaptions(captions);
	            karaokeGroups.value = captionService.karaokeGroups;
	            downloadEnabled.value = true;
	        }
	        function downloadSrt() {
	            const blob = new Blob([captionService.asSrt], { type: 'text/plain;charset=utf-8' });
	            FileSaver_minExports.saveAs(blob, 'edited.srt');
	        }
	        return (_ctx, _cache) => {
	            return (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
	                vue.createElementVNode("div", _hoisted_1, [
	                    vue.createElementVNode("form", null, [
	                        vue.createVNode(script$6, { onFileSelected: onFileSelected }),
	                        vue.createElementVNode("button", {
	                            type: "button",
	                            class: "button is-primary",
	                            disabled: !downloadEnabled.value,
	                            onClick: downloadSrt
	                        }, _cache[0] || (_cache[0] = [
	                            vue.createElementVNode("span", { class: "icon" }, [
	                                vue.createElementVNode("i", { class: "fa-solid fa-download" })
	                            ], -1 /* HOISTED */),
	                            vue.createElementVNode("span", null, "Download", -1 /* HOISTED */)
	                        ]), 8 /* PROPS */, _hoisted_2)
	                    ])
	                ]),
	                vue.createVNode(script$1, { "karaoke-groups": karaokeGroups.value }, null, 8 /* PROPS */, ["karaoke-groups"])
	            ], 64 /* STABLE_FRAGMENT */));
	        };
	    }
	});

	script.__file = "src/editor/components/application.component.vue";

	vue.createApp({})
	    .component('application', script)
	    .mount('#app');

})(Vue);
//# sourceMappingURL=index.js.map
