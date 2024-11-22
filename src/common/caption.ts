export interface Word {
    rawWord: string;
    isHighlighted: boolean;
}

export interface Caption {
    index: number;
    startTimeMs: number;
    endTimeMs: number;
    words: Word[];
}