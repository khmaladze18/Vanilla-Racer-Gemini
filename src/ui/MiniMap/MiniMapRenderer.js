export class MiniMapRenderer {
    static draw(ctx, config, track, player, opponents) {
        const { x, y, size, scaleData } = config;
        const { bounds, scale, worldWidth, worldHeight, padding } = scaleData;

        ctx.save();
        ctx.translate(x, y);

        // 1. Draw Background Circle
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 15, 20, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.clip(); // Keep everything inside the circle

        // 2. Transform to Track Space
        ctx.translate(size / 2, size / 2);
        ctx.scale(scale, scale);
        ctx.translate(
            -(bounds.minX + worldWidth / 2) + padding,
            -(bounds.minY + worldHeight / 2) + padding
        );

        // 3. Draw Track
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 60;
        this.tracePath(ctx, track.points);

        // 4. Draw Icons
        opponents.forEach(bot => this.drawIcon(ctx, bot.car.pos, bot.car.heading, '#ff4757', 60));
        this.drawIcon(ctx, player.pos, player.heading, '#00f2ff', 90);

        ctx.restore();
    }

    static tracePath(ctx, points) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.stroke();
    }

    static drawIcon(ctx, pos, heading, color, size) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(heading);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size, -size * 0.8);
        ctx.lineTo(-size, size * 0.8);
        ctx.fill();
        ctx.restore();
    }
}