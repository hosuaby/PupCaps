interface Task {
    timeMs: number;
    task: () => void;
}

export class Timeline {
    private readonly tasks: Task[] = [];
    private timeoutId: NodeJS.Timeout | null = null;

    constructor(private readonly onEnd: () => void) {
    }

    public schedule(timeMs: number, task: () => void) {
        this.tasks.push({ timeMs, task });
    }

    public run() {
        this.tasks.sort((a, b) => a.timeMs - b.timeMs);

        if (!this.tasks.length) {
            throw new Error('Event queue is empty!');
        }

        const first = this.tasks[0];
        this.timeoutId = setTimeout(() => this.exec(first.timeMs, 0), first.timeMs);
    }

    public stop() {
        clearTimeout(this.timeoutId!);
        this.onEnd();
    }

    private exec(timeMs: number, index: number) {
        this.tasks[index].task();

        if (index < this.tasks.length - 1) {
            const next = this.tasks[index + 1];
            const timeout = next.timeMs - timeMs;
            this.timeoutId = setTimeout(() => this.exec(next.timeMs, index + 1), timeout);
        } else {
            this.onEnd();
        }
    }
}