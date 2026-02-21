import { Vector2D } from '../utils/Vector2D.js';

export class Track {
    constructor() {
        this.trackWidth = 180;
        this.points = [];
        this.generateRandomCircuit();
    }

    generateRandomCircuit() {
        const waypoints = [];
        const numWaypoints = 10;
        const centerX = 1200, centerY = 1200, baseRadius = 900;

        for (let i = 0; i < numWaypoints; i++) {
            const angle = (i / numWaypoints) * Math.PI * 2;
            const randomRadius = baseRadius * (0.7 + Math.random() * 0.8);
            waypoints.push(new Vector2D(centerX + Math.cos(angle) * randomRadius, centerY + Math.sin(angle) * randomRadius));
        }
        waypoints.push(waypoints[0]); // Close loop
        this.points = this.generateSmoothPath(waypoints, 40);
    }

    draw(ctx) {
        // 1. Grass (Environment)
        ctx.strokeStyle = '#1a3317';
        ctx.lineWidth = this.trackWidth + 140;
        this.renderPath(ctx);

        // 2. Sand/Run-off
        ctx.strokeStyle = '#d4c38d';
        ctx.lineWidth = this.trackWidth + 40;
        this.renderPath(ctx);

        // 3. Main Asphalt
        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = this.trackWidth;
        this.renderPath(ctx);

        // 4. THE FIX: Segmented Kerbs (Red & White)
        this.drawSegmentedKerbs(ctx);

        // 5. Subtle Center Markings
        ctx.setLineDash([40, 80]);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 4;
        this.renderPath(ctx);
        ctx.setLineDash([]);
    }

    /**
     * Draws kerbs by iterating through points and alternating colors.
     * This prevents the "sliding" dash look and creates solid blocks.
     */
    drawSegmentedKerbs(ctx) {
        const kerbWidth = 15;
        const segmentStep = 4; // Draw a block every 4 points for consistent size

        for (let i = 0; i < this.points.length; i += segmentStep) {
            const p1 = this.points[i];
            const p2 = this.points[(i + segmentStep) % this.points.length];

            // Alternate Red and White
            ctx.strokeStyle = (Math.floor(i / segmentStep) % 2 === 0) ? '#e74c3c' : '#ffffff';
            ctx.lineWidth = kerbWidth;

            // Draw Inner Edge
            this.drawEdgeSegment(ctx, p1, p2, -1.02);
            // Draw Outer Edge
            this.drawEdgeSegment(ctx, p1, p2, 1.02);
        }
    }

    drawEdgeSegment(ctx, p1, p2, side) {
        const getOffset = (p, next) => {
            const dx = next.x - p.x;
            const dy = next.y - p.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            return {
                x: (-dy / len) * (this.trackWidth / 2) * side,
                y: (dx / len) * (this.trackWidth / 2) * side
            };
        };

        const offset1 = getOffset(p1, p2);

        ctx.beginPath();
        ctx.moveTo(p1.x + offset1.x, p1.y + offset1.y);
        ctx.lineTo(p2.x + offset1.x, p2.y + offset1.y);
        ctx.stroke();
    }

    // --- Helper Methods ---

    renderPath(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    generateSmoothPath(points, segments) {
        const smooth = [];
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? points.length - 2 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[(i + 2) % points.length];
            for (let t = 0; t < 1; t += 1 / segments) {
                smooth.push(new Vector2D(this.catmull(p0.x, p1.x, p2.x, p3.x, t), this.catmull(p0.y, p1.y, p2.y, p3.y, t)));
            }
        }
        return smooth;
    }

    catmull(p0, p1, p2, p3, t) {
        const v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5, t2 = t * t, t3 = t * t2;
        return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
    }

    getIsOnTrack(position) {
        let minDistance = Infinity;

        // 1. Find the distance to the nearest point on the track spine
        // Note: For high performance, you'd only check nearby points, 
        // but for now, we check the whole array.
        for (let i = 0; i < this.points.length; i++) {
            const dist = position.clone().sub(this.points[i]).getMagnitude();
            if (dist < minDistance) minDistance = dist;
        }

        // 2. Compare against half the track width
        // Return the distance outside the track (0 if inside)
        const limit = this.trackWidth / 2;
        return Math.max(0, minDistance - limit);
    }

    drawStartingGrid(ctx) {
        const p1 = this.points[0];
        const p2 = this.points[5]; // Look slightly ahead for a stable angle
        const startAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        // Perpendicular vector for side-offsets
        const rightX = Math.cos(startAngle + Math.PI / 2);
        const rightY = Math.sin(startAngle + Math.PI / 2);

        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        ctx.lineWidth = 3;

        // Draw 4 Grid Boxes (Player + 3 AI)
        for (let i = 0; i < 4; i++) {
            const sideOffset = (i % 2 === 0 ? 1 : -1) * 45;
            const backOffset = Math.floor(i / 2) * -80;

            const bx = p1.x + (rightX * sideOffset) + (Math.cos(startAngle) * backOffset);
            const by = p1.y + (rightY * sideOffset) + (Math.sin(startAngle) * backOffset);

            // Draw a professional white bracket/box around the position
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(startAngle);

            // The Box shape
            ctx.strokeRect(-25, -15, 50, 30);

            // Optional: Draw a "Pole Position" number for the first box
            if (i === 0) {
                ctx.fillStyle = "white";
                ctx.font = "bold 12px Arial";
                ctx.fillText("1", -20, -20);
            }
            ctx.restore();
        }

        // Draw the Finish Line (Checkered pattern style)
        ctx.strokeStyle = "white";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(p1.x + rightX * 100, p1.y + rightY * 100);
        ctx.lineTo(p1.x - rightX * 100, p1.y - rightY * 100);
        ctx.stroke();

        ctx.restore();
    }

    // Inside Track.js
    generateLinearTrack(length = 50) {
        this.points = [];
        let currentPos = new Vector2D(1200, 1200);
        let angle = -Math.PI / 2; // Facing Up

        for (let i = 0; i < length; i++) {
            this.points.push(new Vector2D(currentPos.x, currentPos.y));

            // Add "Wander" - slowly change angle for curves
            angle += (Math.random() - 0.5) * 1.2;

            // Extend the road forward
            currentPos.x += Math.cos(angle) * 300;
            currentPos.y += Math.sin(angle) * 300;
        }

        // We do NOT close the loop here.
        // Use the existing generateSmoothPath to refine these points.
        this.points = this.generateSmoothPath(this.points, 10);
    }
}