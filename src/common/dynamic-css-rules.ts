import {toMillis} from '../common/timecodes';

export type FilterType = 'indexes' | 'timecodes' | 'words';

export interface Filter {
    cssClass: string;
    type: FilterType;
    args: string[];
}

export function normalizeTimecode(timecode: string): string {
    const [ hh, mm, ss, ms ] = timecode.split(/[^\d]+/);
    return `${hh}:${mm}:${ss}.${ms}`;
}

export abstract class AbstractDynamicCssRule {
    protected constructor(protected readonly targetSelectors: string[],
                          public readonly appliedCssClass: string) {
    }

    public isApplied(target: HTMLElement, captionIndex: number, timeMs: number, words: string[]): boolean {
        let targetClasses = target.getAttribute('class')?.split(' ') || [];

        for (const targetSelector of this.targetSelectors) {
            if (targetSelector.startsWith('#')) {
                const idSelector = targetSelector.slice(1);
                if (target.getAttribute('id') != idSelector) {
                    return false;
                }
            } else if (targetSelector.startsWith('.')) {
                const classSelector = targetSelector.slice(1);
                if (!targetClasses.includes(classSelector)) {
                    return false;
                }
            } else {
                throw new Error(`Unsupported target selector: '${targetSelector}'`);
            }
        }

        return true;
    }
}

export class IndexesDynamicCssRule extends AbstractDynamicCssRule {
    constructor(targetSelectors: string[],
                appliedCssClass: string,
                private readonly startIndexInclusive: number,
                private readonly endIndexInclusive?: number) {
        super(targetSelectors, appliedCssClass);
    }

    isApplied(target: HTMLElement, captionIndex: number, timeMs: number, words: string[]): boolean {
        return super.isApplied(target, captionIndex, timeMs, words)
            && this.startIndexInclusive <= captionIndex
            && (this.endIndexInclusive ? this.endIndexInclusive >= captionIndex : true);
    }
}

export class TimecodesDynamicCssRule extends AbstractDynamicCssRule {
    constructor(targetSelectors: string[],
                appliedCssClass: string,
                private readonly startTimeMsInclusive: number,
                private readonly endTimeMsInclusive?: number) {
        super(targetSelectors, appliedCssClass);
    }

    isApplied(target: HTMLElement, captionIndex: number, timeMs: number, words: string[]): boolean {
        return super.isApplied(target, captionIndex, timeMs, words)
            && this.startTimeMsInclusive <= timeMs
            && (this.endTimeMsInclusive ? this.endTimeMsInclusive >= timeMs : true);
    }
}

export function createDynamicCssRule(targetSelectors: string[], filter: Filter): AbstractDynamicCssRule {
    switch (filter.type) {
        case 'indexes':
            const [ startIndex, endIndex ] = filter.args.map(arg => Number(arg));
            return new IndexesDynamicCssRule(targetSelectors, filter.cssClass, startIndex, endIndex);
        case 'timecodes':
            const [ startMs, endMs ] = filter.args.map(normalizeTimecode).map(toMillis);
            return new TimecodesDynamicCssRule(targetSelectors, filter.cssClass, startMs, endMs);
        default:
            throw new Error(`Unknown filter type '${filter.type}'!`);
    }
}