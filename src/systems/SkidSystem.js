export class SkidSystem {
    constructor() {
        this.maxMarks = 500; // Optimization: limit total segments
        this.marks = [];
    }

    // Logic: If car is turning hard or sliding, add a mark
    update(car) {
        // Calculate lateral drift (how much the car is sliding sideways)
        // We check the difference between where the car is facing and where it is actually moving
        const drift = Math.abs(car.speed) > 100 && Math.abs(this.getLateralVelocity(car)) > 40;

        if (drift) {
            this.marks.push({
                x: car.pos.x,
                y: car.pos.y,
                angle: car.heading,
                opacity: 0.4
            });

            if (this.marks.length > this.maxMarks) this.marks.shift();
        }
    }

    getLateralVelocity(car) {
        // Dot product simplified for 2D heading
        const sn = Math.sin(car.heading);
        const cs = Math.cos(car.heading);
        return -sn * car.velocity.x + cs * car.velocity.y;
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 20; // Width of the tire marks
        ctx.lineCap = 'round';

        if (this.marks.length < 2) {
            ctx.restore();
            return;
        }

        ctx.beginPath();
        ctx.moveTo(this.marks[0].x, this.marks[0].y);

        for (let i = 1; i < this.marks.length; i++) {
            const m = this.marks[i];
            const prev = this.marks[i - 1];

            // Only connect if points are close (prevents lines jumping across track)
            const dist = Math.hypot(m.x - prev.x, m.y - prev.y);
            if (dist < 30) {
                ctx.lineTo(m.x, m.y);
            } else {
                ctx.moveTo(m.x, m.y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }
}