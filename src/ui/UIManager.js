export class UIManager {
    constructor() {
        this.screens = {
            menu: document.getElementById('main-menu'),
            hud: document.getElementById('hud'),
            countdown: document.getElementById('countdown-overlay')
        };

        this.elements = {
            speed: document.getElementById('speed-val'),
            lap: document.getElementById('lap-count'),
            position: document.getElementById('position'),
            countdownText: document.getElementById('countdown-text'),
            lights: [
                document.getElementById('light-1'),
                document.getElementById('light-2'),
                document.getElementById('light-3')
            ]
        };
    }

    /**
     * Switch between UI states (Menu -> Racing)
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(s => {
            if (s) s.classList.add('hidden');
        });

        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
        }
    }

    /**
     * High-performance update for racing HUD
     */
    updateHUD(data) {
        const speedEl = document.getElementById('speed-val');
        if (speedEl) {
            // Math.abs turns -15 into 15
            const displaySpeed = Math.floor(Math.abs(data.speed || 0));
            speedEl.innerText = displaySpeed;
        }
        // 2. Update Lap (e.g., "1/3")
        const lapEl = document.getElementById('lap-count');
        if (lapEl) lapEl.innerText = data.lap;

        // 3. Update Position (e.g., "1/5")
        const posEl = document.getElementById('position');
        if (posEl) posEl.innerText = data.position;

        // 4. Update Level
        const levelEl = document.getElementById('level-val');
        if (levelEl) levelEl.innerText = data.level;
    }

    /**
     * Professional F1-style countdown sequence
     * Returns a Promise that resolves when the race starts (GO!)
     */
    async startCountdown() {
        const overlay = this.screens.countdown;
        const text = this.elements.countdownText;
        const lights = this.elements.lights;

        if (!overlay || !text) return;

        // Reset and show
        overlay.classList.remove('hidden', 'fade-out');
        lights.forEach(l => l.className = 'light');
        text.innerText = "READY?";

        const steps = [
            { val: "3", color: "active-red" },
            { val: "2", color: "active-red" },
            { val: "1", color: "active-red" },
            { val: "GO!", color: "active-green" }
        ];

        // Sequence Loop
        for (let i = 0; i < steps.length; i++) {
            text.innerText = steps[i].val;

            if (steps[i].val === "GO!") {
                // Flash all lights green
                lights.forEach(l => {
                    l.classList.remove('active-red');
                    l.classList.add('active-green');
                });
            } else {
                // Turn on red lights one by one
                if (lights[i]) lights[i].classList.add('active-red');
            }

            // Wait 1 second per step
            await new Promise(r => setTimeout(r, 1000));
        }

        // Exit Animation
        overlay.classList.add('fade-out');

        return new Promise(resolve => {
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.classList.remove('fade-out');
                // Resolve so Engine knows the race has officially started
                resolve();
            }, 500);
        });
    }
}