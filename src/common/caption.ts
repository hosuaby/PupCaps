export interface Word {
    rawWord: string;
    isHighlighted: boolean;
    isBeforeHighlighted: boolean;
    isAfterHighlighted: boolean;
    highlightClass?: string;
}

export interface Caption {
    index: number;
    startTimeMs: number;
    endTimeMs: number;
    words: Word[];
}