export class MiniMapLogic {
    static getBounds(points) {
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        points.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });
        return { minX, minY, maxX, maxY };
    }

    static getScalingData(points, mapSize) {
        const bounds = this.getBounds(points);
        const padding = 200; // World-space padding
        const worldWidth = (bounds.maxX - bounds.minX) + padding * 2;
        const worldHeight = (bounds.maxY - bounds.minY) + padding * 2;
        const scale = mapSize / Math.max(worldWidth, worldHeight);

        return { bounds, scale, worldWidth, worldHeight, padding };
    }
}