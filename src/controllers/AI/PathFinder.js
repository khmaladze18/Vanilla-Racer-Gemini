export class PathFinder {
    static getClosestIndex(currentPos, points, currentIndex, windowSize = 30) {
        let bestDist = Infinity;
        let bestIdx = currentIndex;
        const end = Math.min(currentIndex + windowSize, points.length);

        for (let i = currentIndex; i < end; i++) {
            const p = points[i];
            const d = (currentPos.x - p.x) ** 2 + (currentPos.y - p.y) ** 2;
            if (d < bestDist) {
                bestDist = d;
                bestIdx = i;
            }
        }
        return bestIdx;
    }

    static getTargetPoint(points, currentIndex, lookAhead) {
        const idx = Math.min(currentIndex + lookAhead, points.length - 1);
        return points[idx];
    }
}