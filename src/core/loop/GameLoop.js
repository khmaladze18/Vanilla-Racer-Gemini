import { LOOP_CONFIG } from './LoopConfig.js';

export class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;

        this.lastTime = 0;
        this.accumulator = 0;
        this.isRunning = false;
        this.requestId = null;
    }

    tick(currentTime) {
        if (!this.isRunning) return;

        // 1. Calculate delta since last frame
        const frameTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // 2. Accumulate time
        this.accumulator += Math.min(frameTime, LOOP_CONFIG.MAX_FRAME_TIME);

        // 3. Fixed Step Updates (Physics)
        while (this.accumulator >= LOOP_CONFIG.DT) {
            this.update(LOOP_CONFIG.DT);
            this.accumulator -= LOOP_CONFIG.DT;
        }

        // 4. Variable Step Render (Graphics)
        this.render();

        this.requestId = requestAnimationFrame((t) => this.tick(t));
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        this.requestId = requestAnimationFrame((t) => this.tick(t));
    }

    stop() {
        this.isRunning = false;
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
    }
}