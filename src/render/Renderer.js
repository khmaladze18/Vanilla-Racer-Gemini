import { Camera } from './Camera.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.camera = new Camera();

        this.width = 0;
        this.height = 0;
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    // Enter "World Space" (where the car lives)
    applyTransform() {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
    }

    // Return to "Screen Space" (where HUD/MiniMap lives)
    restoreTransform() {
        this.ctx.restore();
    }

    clear() {
        // We use a color clear instead of just clearRect 
        // to create a "Grass" or "Background" base
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}