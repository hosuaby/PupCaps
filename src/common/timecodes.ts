export function toMillis(timecodes: string): number {
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