import {readFileSync} from 'fs';
import {Caption, Word} from '../common/caption';
import {toMillis} from '../common/timecodes';

const indexLinePattern = /^\d+$/;
const timecodesLinePattern = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/;
const highlightedWordPattern = /^\[(.+)](?:\((\w+)\))?$/;

export function parseCaptions(srtCaptionsFile: string): Caption[] {
    const captionsSrc = readFileSync(srtCaptionsFile, 'utf-8');
    return readCaptions(captionsSrc);
}

function readCaptions(srtContent: string): Caption[] {
    const lines = srtContent.split('\n');
    const captions: Caption[] = [];

    let index: number = 0;
    let timecodesStart: string | null = null;
    let timecodesEnd: string | null = null;

    for (const line of lines) {
        let match;
        if ((match = line.match(indexLinePattern))) {
            index = Number(line);
        } else if ((match = line.match(timecodesLinePattern))) {
            timecodesStart = match[1];
            timecodesEnd = match[2];
        } else if (line.length) {
            const start = toMillis(timecodesStart!);
            const end = toMillis(timecodesEnd!);

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

export function readWords(text: string): Word[] {
    const words = splitText(text);
    const highlightedIndex = words.findIndex(word => word.match(highlightedWordPattern));

    const res: Word[] = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const match = word.match(highlightedWordPattern);
        const rawWord = match ? match[1] : word;
        const highlightClass = match && match[2] ? match[2] : null;

        const isHighlighted = Boolean(match);
        const isBeforeHighlighted = Boolean(~highlightedIndex && !isHighlighted && i < highlightedIndex);
        const isAfterHighlighted = Boolean(~highlightedIndex && !isHighlighted && i > highlightedIndex);

        const wordObject: Word = {
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

function splitText(text: string): string[] {
    const words: string[] = [];

    let currentWord = '';
    let isCurrentHighlighted = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const isWhitespace = /^\s$/.test(char);

        if (!isWhitespace) {
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
        } else {
            // char is a whitespace
            if (isCurrentHighlighted) {
                currentWord += char;
            } else if (currentWord) {
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