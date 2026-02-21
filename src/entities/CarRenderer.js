export class CarRenderer {
    static draw(ctx, car) {
        ctx.save();
        ctx.translate(car.pos.x, car.pos.y);
        ctx.rotate(car.heading);

        // 1. Shadow (Drawn first, slightly offset)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.drawRoundedRect(ctx, -car.height / 2 + 5, -car.width / 2 + 5, car.height, car.width, 6);

        // 2. Chassis
        ctx.fillStyle = car.color;
        this.drawRoundedRect(ctx, -car.height / 2, -car.width / 2, car.height, car.width, 6);

        // 3. Windshield/Cockpit
        ctx.fillStyle = '#111';
        ctx.fillRect(-car.height / 8, -car.width / 2 + 4, car.height / 2.5, car.width - 8);

        // 4. Wheels
        ctx.fillStyle = '#222';
        const wheelW = 12;
        const wheelH = 6;
        // Front Wheels
        ctx.fillRect(car.height / 4, -car.width / 2 - 2, wheelW, wheelH);
        ctx.fillRect(car.height / 4, car.width / 2 - 4, wheelW, wheelH);
        // Rear Wheels
        ctx.fillRect(-car.height / 2 + 4, -car.width / 2 - 2, wheelW, wheelH);
        ctx.fillRect(-car.height / 2 + 4, car.width / 2 - 4, wheelW, wheelH);

        // 5. Headlights (Visual Glow)
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'cyan';
        ctx.fillRect(car.height / 2 - 6, -car.width / 2 + 2, 6, 5);
        ctx.fillRect(car.height / 2 - 6, car.width / 2 - 7, 6, 5);

        // 6. Brake Lights (Only when braking)
        if (car.isBraking) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff4757';
            ctx.fillStyle = '#ff4757';
            ctx.fillRect(-car.height / 2, -car.width / 2 + 3, 4, 6);
            ctx.fillRect(-car.height / 2, car.width / 2 - 9, 4, 6);
        }

        ctx.restore();
    }

    /**
     * Compatibility-friendly rounded rect
     */
    static drawRoundedRect(ctx, x, y, width, height, radius) {
        // Fallback for browsers that don't support ctx.roundRect
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(x, y, width, height, radius);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            ctx.fill();
        }
    }
}