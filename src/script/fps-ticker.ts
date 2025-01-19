export class FPSTicker {
    private readonly interval: number;
    private lastTime: number = 0;
    private onTick: (deltaTime: number) => void = () => {};
    private timeoutId: NodeJS.Timeout | null = null;

    constructor(fps: number) {
        this.interval = 1000 / fps;
    }

    public start(onTick: (deltaTime: number) => void = () => {}) {
        this.onTick = onTick;
        this.lastTime = Date.now();
        this.tick();
    }

    public stop() {
        clearTimeout(this.timeoutId!);
    }

    private tick() {
        const now = Date.now();
        const deltaTime = now - this.lastTime;

        if (deltaTime >= this.interval) {
            this.lastTime = now - (deltaTime % this.interval);  // Adjust for drift
            this.onTick(deltaTime);
        }

        this.timeoutId = setTimeout(() => this.tick(), this.interval - (Date.now() - this.lastTime));
    }
}