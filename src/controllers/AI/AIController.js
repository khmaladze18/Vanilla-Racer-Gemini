import { PathFinder } from './PathFinder.js';
import { SteeringSystem } from './SteeringSystem.js';
import { SpeedSystem } from './SpeedSystem.js';

export class AIController {
    constructor(car, track) {
        this.car = car;
        this.track = track;
        this.currentPathIndex = 0;
        this.lookAheadDistance = 18;
    }

    update(dt, difficulty = 0.5) {
        // 1. Navigation
        this.currentPathIndex = PathFinder.getClosestIndex(
            this.car.pos,
            this.track.points,
            this.currentPathIndex
        );

        // Check for end of track
        if (this.currentPathIndex >= this.track.points.length - 2) {
            this.car.update({ forward: false, backward: true, left: false, right: false }, dt);
            return;
        }

        const target = PathFinder.getTargetPoint(
            this.track.points,
            this.currentPathIndex,
            this.lookAheadDistance
        );

        // 2. Calculation
        const angleDiff = SteeringSystem.getAngleDiff(target, this.car.pos, this.car.heading);

        // 3. Decision Making
        const steering = SteeringSystem.getSteeringInputs(angleDiff, difficulty);
        const speed = SpeedSystem.getSpeedInputs(this.car.speed, this.car.maxSpeed, angleDiff, difficulty);

        const finalInputs = {
            ...steering,
            ...speed
        };

        this.car.update(finalInputs, dt);
    }
}