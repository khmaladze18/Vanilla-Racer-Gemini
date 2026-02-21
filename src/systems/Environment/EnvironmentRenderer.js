export class EnvironmentRenderer {
    static draw(ctx, envData, camera) {
        // Optimization: Define colors once
        const colors = {
            pillar: '#00f2ff',
            base: '#1a1a1a',
            glow: 'rgba(0, 242, 255, 0.3)'
        };

        envData.objects.forEach(obj => {
            // BASIC CULLING: Don't draw if too far from camera
            const distSq = (obj.x - (camera.x + window.innerWidth / 2)) ** 2 +
                (obj.y - (camera.y + window.innerHeight / 2)) ** 2;
            if (distSq > 2000 * 2000) return;

            this.drawPillar(ctx, obj.x, obj.y, colors);
        });
    }

    static drawPillar(ctx, x, y, colors) {
        ctx.save();
        ctx.translate(x, y);

        // Core Pillar (Hexagon)
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            ctx.lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20);
        }
        ctx.closePath();

        ctx.fillStyle = colors.base;
        ctx.fill();
        ctx.strokeStyle = colors.pillar;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.restore();
    }
}