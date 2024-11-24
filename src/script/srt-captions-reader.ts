import {readFileSync} from 'fs';
import {Caption, Word} from '../common/caption';

const indexLinePattern = /^\d+$/;
const timecodesLinePattern = /^(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})$/;
const highlightedWordPattern = /^\[(.+)]$/;

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
    const words = text.split(/\s+/);
    const highlightedIndex = words.findIndex(word => word.match(highlightedWordPattern));

    const res: Word[] = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const match = word.match(highlightedWordPattern);
        const rawWord = match ? match[1] : word;

        const isHighlighted = Boolean(match);
        const isBeforeHighlighted = Boolean(~highlightedIndex && !isHighlighted && i < highlightedIndex);
        const isAfterHighlighted = Boolean(~highlightedIndex && !isHighlighted && i > highlightedIndex);

        res.push({
            rawWord,
            isHighlighted,
            isBeforeHighlighted,
            isAfterHighlighted,
        });
    }

    return res;
}

function toMillis(timecodes: string): number {
    const parts = timecodes.split(/[:.]/).map(Number);

    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts[2];
    const milliseconds = parts[3];

    return hours * 3_600_000    // hours to millis
        + minutes * 60_000      // minutes to millis
        + seconds * 1000        // second to millis
        + milliseconds;
}