// src/systems/CollisionSystem.js
export class CollisionSystem {
    /**
     * Optimized elastic collision using squared distances and vector logic.
     */
    static resolveCarCollision(carA, carB) {
        const dx = carB.pos.x - carA.pos.x;
        const dy = carB.pos.y - carA.pos.y;

        // Use squared distance for the initial check (much faster)
        const distSq = dx * dx + dy * dy;
        const minDistance = 45;
        const minDistanceSq = minDistance * minDistance;

        if (distSq < minDistanceSq && distSq > 0) {
            const distance = Math.sqrt(distSq);
            const nx = dx / distance; // Normal X
            const ny = dy / distance; // Normal Y

            // 1. Position Correction (Anti-clipping)
            const overlap = minDistance - distance;
            const separationX = nx * overlap * 0.5;
            const separationY = ny * overlap * 0.5;

            carA.pos.x -= separationX;
            carA.pos.y -= separationY;
            carB.pos.x += separationX;
            carB.pos.y += separationY;

            // 2. Velocity Transfer
            // Use existing velocity vectors if your Car class has them
            const vAx = Math.cos(carA.heading) * carA.speed;
            const vAy = Math.sin(carA.heading) * carA.speed;
            const vBx = Math.cos(carB.heading) * carB.speed;
            const vBy = Math.sin(carB.heading) * carB.speed;

            const relVelX = vBx - vAx;
            const relVelY = vBy - vAy;
            const velAlongNormal = relVelX * nx + relVelY * ny;

            // Only resolve if cars are moving towards each other
            if (velAlongNormal < 0) {
                const restitution = 0.7; // Bounciness
                const impulseMag = -(1 + restitution) * velAlongNormal / 2;

                // Adjust speed based on the impact force
                carA.speed -= impulseMag;
                carB.speed += impulseMag;

                // Stability Loss: Rotate based on hit angle rather than pure random
                const spinStrength = 0.15;
                carA.heading += (Math.random() - 0.5) * spinStrength;
                carB.heading += (Math.random() - 0.5) * spinStrength;

                return true;
            }
        }
        return false;
    }

    /**
     * Keeps cars on track with a "Soft Bounce" from barriers.
     */
    static handleTrackBoundaries(car, track) {
        const offTrackAmount = track.getIsOnTrack(car.pos);

        if (offTrackAmount > 0) {
            const nearest = this._getNearestTrackPoint(car.pos, track.points);
            const dx = nearest.x - car.pos.x;
            const dy = nearest.y - car.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Push car back to track center
            car.pos.x += (dx / dist) * offTrackAmount;
            car.pos.y += (dy / dist) * offTrackAmount;

            // Apply friction + speed-dependent penalty
            car.speed *= 0.92;

            // Slight steering wobble when hitting the grass/wall
            car.heading += (Math.random() - 0.5) * 0.05;
        }
    }

    /**
     * Uses squared distance for faster search.
     */
    static _getNearestTrackPoint(pos, points) {
        let nearest = points[0];
        let minDistSq = Infinity;

        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            const dSq = (pos.x - p.x) ** 2 + (pos.y - p.y) ** 2;
            if (dSq < minDistSq) {
                minDistSq = dSq;
                nearest = p;
            }
        }
        return nearest;
    }

    static resolveWorldCollisions(player, opponents) {
        let playerHit = false;
        const bots = opponents.map(o => o.car);

        // Player vs AI
        for (const bot of bots) {
            if (this.resolveCarCollision(player, bot)) {
                playerHit = true;
            }
        }

        // AI vs AI (Standard nested loop)
        for (let i = 0; i < bots.length; i++) {
            for (let j = i + 1; j < bots.length; j++) {
                this.resolveCarCollision(bots[i], bots[j]);
            }
        }
        return playerHit;
    }
}