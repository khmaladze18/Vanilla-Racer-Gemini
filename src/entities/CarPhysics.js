export class CarPhysics {
    static calculateSpeed(car, input, dt) {
        // Ensure newSpeed is a number; fallback to 0 if car.speed is undefined/NaN
        let newSpeed = Number(car.speed) || 0;
        const accel = car.acceleration || 50;
        const brake = car.braking || 100;

        if (input.forward) {
            newSpeed += accel * dt;
        } else if (input.backward) {
            // Braking: subtract from speed, but we will clamp to 0 in Car.js
            newSpeed -= brake * dt;
        } else {
            // Natural deceleration (friction)
            newSpeed *= 0.97;
        }

        // Final safety check: if calculation results in NaN, return 0
        return isNaN(newSpeed) ? 0 : newSpeed;
    }

    static calculateHeading(car, input, dt) {
        // 1. Safety Guard: Don't turn if car is nearly stationary
        if (!input || Math.abs(car.speed) < 2) return car.heading;

        const turnSpeed = car.turnSpeed || 3.5;
        // THE FIX: Set maxSpeed to 70 to match your new requirement
        const maxSpeed = car.maxSpeed || 70;

        // 2. Prevent NaN: Ensure maxSpeed isn't 0
        const safeMaxSpeed = maxSpeed === 0 ? 1 : maxSpeed;
        const speedRatio = Math.min(1, Math.abs(car.speed) / safeMaxSpeed);

        // Steering ease: Steering is harder at very high speeds
        let steerEase = speedRatio > 0.8 ? 0.8 : 1.0;

        // turnDir: Flips steering if going in reverse (if you allow negative speed)
        const turnDir = car.speed >= 0 ? 1 : -1;

        let h = car.heading;
        if (input.left) h -= turnSpeed * steerEase * turnDir * dt;
        if (input.right) h += turnSpeed * steerEase * turnDir * dt;

        return h;
    }
}