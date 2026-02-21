export class SteeringSystem {
    static getAngleDiff(target, carPos, carHeading) {
        const dx = target.x - carPos.x;
        const dy = target.y - carPos.y;
        const angleToTarget = Math.atan2(dy, dx);

        let diff = angleToTarget - carHeading;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        return diff;
    }

    static getSteeringInputs(angleDiff, difficulty) {
        const threshold = 0.08 / (1 + difficulty);
        return {
            left: angleDiff < -threshold,
            right: angleDiff > threshold
        };
    }
}