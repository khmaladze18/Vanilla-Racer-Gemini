import { GameLoop } from './loop/GameLoop.js';
import { Renderer } from '../render/Renderer.js';
import { InputHandler } from '../controllers/Input/InputHandler.js';
import { UIManager } from '../ui/UIManager.js';
import { Track } from '../track/Track.js';
import { SkidSystem } from '../systems/SkidSystem.js';
import { CollisionSystem } from '../systems/CollisionSystem.js';
import { EnvironmentData } from '../systems/Environment/EnvironmentData.js';
import { EnvironmentRenderer } from '../systems/Environment/EnvironmentRenderer.js';
import { MiniMapLogic } from '../ui/MiniMap/MiniMapLogic.js';
import { MiniMapRenderer } from '../ui/MiniMap/MiniMapRenderer.js';
import { RaceManager } from './RaceManager.js';

export class Engine {
    constructor() {
        this.currentLevel = 1;
        this.maxLaps = 3;

        // 1. Setup Canvas & Core Systems
        const canvas = document.getElementById('game-canvas');
        this.renderer = new Renderer(canvas);
        this.input = new InputHandler();
        this.ui = new UIManager();

        // 2. Initial Setup
        this.setupLevel();

        // 3. Loop setup
        this.loop = new GameLoop((dt) => this.update(dt), () => this.render());
        this.cameraShake = 0;
        this.raceStarted = false;

        // --- FIXED: Handle event listeners here instead of a missing init() ---
        this.renderer.resize();
        window.addEventListener('resize', () => this.renderer.resize());

        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startRace());
        }

        const exitBtn = document.getElementById('exit-btn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitGame());
        }
    }

    // This replaces much of the old init() logic for better level resetting
    setupLevel() {
        this.track = new Track(window.innerWidth, window.innerHeight);

        this.miniMapConfig = {
            size: 220, margin: 20, x: window.innerWidth - 240, y: 20,
            scaleData: MiniMapLogic.getScalingData(this.track.points, 220)
        };

        this.envData = new EnvironmentData();
        this.envData.generate(this.track.points);
        this.skidSystem = new SkidSystem();

        this.race = new RaceManager(this.track);
        this.player = this.race.spawnPlayer();

        // Scale AI count: Level 1 has 3, Level 2 has 4, etc.
        const aiCount = 2 + this.currentLevel;
        this.opponents = this.race.spawnAI(aiCount);
    }

    async startRace() {
        this.ui.showScreen('hud');
        this.loop.start();
        await this.ui.startCountdown();
        this.raceStarted = true;
    }

    async startNextLevel() {
        this.raceStarted = false;
        this.currentLevel++;

        // Re-setup all entities for the new map
        this.setupLevel();

        // UI Transition
        await this.ui.startCountdown();
        this.raceStarted = true;
    }

    update(dt) {
        if (!this.raceStarted) return;

        const entities = [this.player, ...this.opponents.map(o => o.car)];

        entities.forEach(entity => {
            if (entity === this.player) entity.update(this.input.keys, dt);
            else this.opponents.find(o => o.car === entity).update(dt);

            CollisionSystem.handleTrackBoundaries(entity, this.track);
            this.skidSystem.update(entity);
        });

        if (CollisionSystem.resolveWorldCollisions(this.player, this.opponents)) {
            this.cameraShake = 10;
        }

        // --- NEW RACE LOGIC ---
        const raceResult = this.race.updateRaceStatus(this.player, this.opponents);

        if (raceResult === 'WIN') {
            console.log("Player won! Loading next level...");
            this.startNextLevel();
        } else if (raceResult === 'LOST') {
            alert(`GAME OVER! You reached Level ${this.currentLevel} but didn't take 1st place.`);
            location.reload(); // Hard reset
        }

        this.renderer.camera.update(this.player.pos.x, this.player.pos.y, this.renderer.width, this.renderer.height);

        // Update UI with level and lap info
        this.ui.updateHUD({
            speed: this.player.speed,
            lap: `${this.race.getPlayerLap(this.player)}/${this.maxLaps}`,
            level: this.currentLevel
        });
    }



    render() {
        this.renderer.clear();

        // World Space
        this.applyEffects();
        this.renderer.applyTransform();

        EnvironmentRenderer.draw(this.renderer.ctx, this.envData, this.renderer.camera);
        this.track.draw(this.renderer.ctx);
        this.skidSystem.draw(this.renderer.ctx);
        this.race.draw(this.renderer.ctx, this.player, this.opponents);

        this.renderer.restoreTransform();
        this.renderer.ctx.restore(); // Final shake restore

        // Screen Space
        MiniMapRenderer.draw(this.renderer.ctx, this.miniMapConfig, this.track, this.player, this.opponents);
    }

    applyEffects() {
        if (this.cameraShake > 0) {
            this.renderer.ctx.save();
            this.renderer.ctx.translate((Math.random() - 0.5) * this.cameraShake, (Math.random() - 0.5) * this.cameraShake);
            this.cameraShake *= 0.9;
        }
    }

    exitGame() {
        location.reload();
    }
}