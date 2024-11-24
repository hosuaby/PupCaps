export class StatsPrinter {
    private statsPrinted = false;

    public print(stats: Object) {
        const lines = Object
            .entries(stats)
            .map(([key, value]) => `${key}: ${value}`);

        if (this.statsPrinted) {
            process.stdout.write(`\x1b[${lines.length}A`);  // Move up N lines
        }

        lines.forEach((line) => {
            process.stdout.write(`\r${line.padEnd(40)}\n`); // Ensure the line is fully overwritten
        });

        this.statsPrinted = true;
    }
}