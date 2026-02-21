export class SpeedSystem {
    static getSpeedInputs(carSpeed, maxSpeed, angleDiff, difficulty) {
        const topSpeed = maxSpeed * (0.65 + (difficulty * 0.35));
        const turnIntensity = Math.abs(angleDiff);

        if (turnIntensity > 0.45) {
            return { forward: false, backward: true }; // Hard Brake
        } else if (turnIntensity > 0.2) {
            return { forward: false, backward: false }; // Coasting
        } else {
            return { forward: carSpeed < topSpeed, backward: false }; // Accelerate
        }
    }
}