import { KEY_MAP } from './KeyConfig.js';

export class InputHandler {
    constructor() {
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };

        this.init();
    }

    init() {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(e, isPressed) {
        const action = KEY_MAP[e.key.toLowerCase()];
        if (action) {
            this.keys[action] = isPressed;
        }
    }

    // New helper to clear inputs (useful for when the game is paused or level ends)
    reset() {
        Object.keys(this.keys).forEach(k => this.keys[k] = false);
    }
}