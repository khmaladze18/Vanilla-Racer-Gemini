import { Vector2D } from '../utils/Vector2D.js';
import { CAR_TYPES } from './CarConfig.js';
import { CarPhysics } from './CarPhysics.js';
import { CarRenderer } from './CarRenderer.js';

export class Car {
    constructor(x, y, color = '#00f2ff', type = 'DEFAULT') {
        const config = CAR_TYPES[type] || CAR_TYPES.DEFAULT;
        Object.assign(this, config);

        this.pos = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.heading = -Math.PI / 2;
        this.color = color;
        this.speed = 0;
        this.isBraking = false;
    }

    update(input, dt) {
        if (!input || isNaN(dt)) return;

        this.isBraking = !!input.backward;

        // 1. Get raw calculation
        let calculatedSpeed = CarPhysics.calculateSpeed(this, input, dt);

        // 2. THE FIX: Allow limited reverse
        // Top speed forward: 70
        // Top speed backward: -20
        this.speed = Math.max(-150, Math.min(calculatedSpeed, 250));

        // 3. Update Heading
        this.heading = CarPhysics.calculateHeading(this, input, dt);

        // 4. Movement
        this.velocity.x = Math.cos(this.heading) * this.speed;
        this.velocity.y = Math.sin(this.heading) * this.speed;

        this.pos.x += this.velocity.x * dt;
        this.pos.y += this.velocity.y * dt;
    }

    draw(ctx) {
        // Ensure the renderer is actually receiving the 'this' context
        CarRenderer.draw(ctx, this);
    }
}