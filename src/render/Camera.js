export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.lerpSpeed = 0.1; // Smoothness of following
    }

    // Follows a target (like the player car) with smoothing
    update(targetX, targetY, width, height) {
        const goalX = targetX - width / 2;
        const goalY = targetY - height / 2;

        this.x += (goalX - this.x) * this.lerpSpeed;
        this.y += (goalY - this.y) * this.lerpSpeed;
    }
}