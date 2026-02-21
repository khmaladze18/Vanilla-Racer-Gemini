import { Car } from '../entities/Car.js';
import { AIController } from '../controllers/AI/AIController.js';

export class RaceManager {
    constructor(track) {
        this.track = track;
        this.maxLaps = 3;
        this.isRaceOver = false;

        // 1. Determine track direction at start
        const p1 = track.points[0];
        const p2 = track.points[1];
        this.startPos = p1;
        this.startAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        // 2. Vectors for grid
        this.fwdX = Math.cos(this.startAngle);
        this.fwdY = Math.sin(this.startAngle);
        this.rightX = -this.fwdY;
        this.rightY = this.fwdX;

        // 3. Track Progress
        // Key: Car instance, Value: { laps: 0, lastIndex: 0 }
        this.participants = new Map();
    }

    spawnPlayer() {
        const spawnX = this.startPos.x + (this.rightX * -40);
        const spawnY = this.startPos.y + (this.rightY * -40);
        const player = new Car(spawnX, spawnY, '#00f2ff');
        player.heading = this.startAngle;

        this.participants.set(player, { laps: 0, lastIndex: 0 });
        return player;
    }

    spawnAI(count) {
        const colors = ['#ff4757', '#ffa502', '#2ed573'];
        const opponents = [];

        for (let i = 0; i < count; i++) {
            const side = (i % 2 === 0) ? 1 : -1;
            const row = Math.floor(i / 2) + 1;

            const spawnX = this.startPos.x + (this.rightX * side * 40) + (this.fwdX * row * -80);
            const spawnY = this.startPos.y + (this.rightY * side * 40) + (this.fwdY * row * -80);

            const botCar = new Car(spawnX, spawnY, colors[i % colors.length]);
            botCar.heading = this.startAngle;

            const controller = new AIController(botCar, this.track);
            controller.currentPathIndex = 0;

            this.participants.set(botCar, { laps: 0, lastIndex: 0 });
            opponents.push(controller);
        }
        return opponents;
    }

    /**
     * Checks if cars have completed laps and returns 'WIN', 'LOST', or null
     */
    updateRaceStatus(player, opponents) {
        if (this.isRaceOver) return null;

        const allCars = [player, ...opponents.map(o => o.car)];

        for (const car of allCars) {
            const data = this.participants.get(car);
            const currentIndex = car.currentPathIndex || 0;

            // Detect finish line cross: Index went from high (near end) to low (near start)
            if (data.lastIndex > this.track.points.length * 0.75 && currentIndex < 10) {
                data.laps++;
                console.log(`${car === player ? 'Player' : 'AI'} Lap: ${data.laps}`);
            }
            data.lastIndex = currentIndex;

            // Check if anyone finished the race
            if (data.laps >= this.maxLaps) {
                this.isRaceOver = true;
                return this.checkPlayerRank(player, opponents);
            }
        }
        return null;
    }

    checkPlayerRank(player, opponents) {
        // Calculate total distance for sorting (Laps * TrackLength + CurrentIndex)
        const getScore = (car) => {
            const data = this.participants.get(car);
            return (data.laps * this.track.points.length) + (car.currentPathIndex || 0);
        };

        const playerResult = getScore(player);
        const aiResults = opponents.map(o => getScore(o.car));

        // If any AI has a higher score than the player, player didn't get 1st
        const playerWon = aiResults.every(aiScore => playerResult > aiScore);

        return playerWon ? 'WIN' : 'LOST';
    }

    getPlayerLap(player) {
        return this.participants.get(player)?.laps || 0;
    }

    draw(ctx, player, opponents) {
        opponents.forEach(bot => bot.car.draw(ctx));
        player.draw(ctx);
    }
}