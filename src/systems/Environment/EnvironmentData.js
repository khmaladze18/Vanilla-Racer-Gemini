export class EnvironmentData {
    constructor() {
        this.objects = []; // Array of {x, y, type}
    }

    generate(trackPoints) {
        this.objects = [];
        // Only calculate once!
        for (let i = 0; i < trackPoints.length; i += 40) {
            const p = trackPoints[i];
            const next = trackPoints[(i + 1) % trackPoints.length];

            const dx = next.x - p.x;
            const dy = next.y - p.y;
            const len = Math.sqrt(dx * dx + dy * dy);

            const nx = -dy / len;
            const ny = dx / len;

            // Store left and right pillar positions
            this.objects.push({ x: p.x + nx * 450, y: p.y + ny * 450, type: 'PILLAR' });
            this.objects.push({ x: p.x - nx * 450, y: p.y - ny * 450, type: 'PILLAR' });
        }
    }
}