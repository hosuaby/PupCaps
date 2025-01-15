import {Caption, haveSameWords} from '../common/captions';
import {Timecode} from '../common/timecodes';

export interface KaraokeWord {
    rawWord: string;
    startTimeMs: number;
    endTimeMs: number;
}

export class KaraokeGroup {
    constructor(public indexStart: number,
                public indexEnd: number,
                public readonly words: KaraokeWord[]) {
    }

    static fromCaptions(captions: Caption[]): KaraokeGroup {
        const indexStart = captions[0].index;
        const indexEnd = captions[captions.length - 1].index;
        const words: KaraokeWord[] = captions
            .map(caption => {
                const highlightedWord = caption.words.filter(word => word.isHighlighted)[0].rawWord;

                return {
                    rawWord: highlightedWord,
                    startTimeMs: caption.startTimeMs,
                    endTimeMs: caption.endTimeMs,
                };
            })

        return new KaraokeGroup(indexStart, indexEnd, words);
    }

    public addAtBeginning(word: KaraokeWord) {
        this.indexStart--;
        this.words.unshift(word);
    }

    public removeFromBeginning(): KaraokeWord {
        this.indexStart++;
        return this.words.splice(0, 1)[0];
    }

    public addAtEnd(word: KaraokeWord) {
        this.indexEnd++;
        this.words.push(word);
    }

    public removeFromEnd(): KaraokeWord {
        this.indexEnd--;
        return this.words.pop()!;
    }

    public shiftIndices(shift: number) {
        this.indexStart += shift;
        this.indexEnd += shift;
    }

    public get id() {
        return `${this.indexStart}-${this.indexEnd}`;
    }

    public get startTimeMs(): number {
        return this.words[0].startTimeMs;
    }

    public get endTimeMs(): number {
        return this.words[this.words.length - 1].endTimeMs;
    }

    public get isEmpty(): boolean {
        return this.words.length === 0;
    }
}

export class CaptionsService {
    private groups: KaraokeGroup[] = [];

    public readCaptions(captions: Caption[]) {
        this.groups = [];

        let lastCaption: Caption | null = null;
        let lastGroup = [];

        for (const caption of captions) {
            if (lastCaption && !haveSameWords(caption, lastCaption!)) {
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

        console.dir(this.groups, {depth: null});
    }

    public moveFirstWordToPrecedentGroup(groupId: number) {
        const karaokeGroup = this.groups[groupId];
        const firstWord = karaokeGroup.removeFromBeginning();

        if (groupId > 0) {
            this.groups[groupId - 1].addAtEnd(firstWord);
        } else {
            const index = karaokeGroup.indexStart - 1;
            const newKaraokeGroup = new KaraokeGroup(index, index, [ firstWord ]);
            this.groups.unshift(newKaraokeGroup);
        }

        if (karaokeGroup.isEmpty) {
            this.groups.splice(groupId, 1);
        }
    }

    public moveLastWordToNextGroup(groupId: number) {
        const karaokeGroup = this.groups[groupId];
        const lastWord = karaokeGroup.removeFromEnd();

        if (groupId < this.groups.length - 1) {
            this.groups[groupId + 1].addAtBeginning(lastWord);
        } else {
            const index = karaokeGroup.indexEnd + 1;
            const newKaraokeGroup = new KaraokeGroup(index, index, [ lastWord ]);
            this.groups.push(newKaraokeGroup);
        }

        if (karaokeGroup.isEmpty) {
            this.groups.splice(groupId, 1);
        }
    }

    public deleteKaraokeGroup(karaokeGroupId: string) {
        const groups: KaraokeGroup[] = [];
        let shift = 0;

        for (const group of this.groups) {
            if (group.id === karaokeGroupId) {
                shift = group.indexStart - group.indexEnd - 1;
            } else {
                if (~shift) {
                    group.shiftIndices(shift);
                }
                groups.push(group);
            }
        }

        this.groups = groups;
    }

    public get karaokeGroups(): KaraokeGroup[] {
        return [...this.groups];
    }

    public get asSrt(): string {
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