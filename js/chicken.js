/* ============================================
   CHICKEN - Duck Class
   ============================================ */
class Chicken {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Duck types
        const types = [
            { name: 'normal', points: 10, speed: 2, color: '#808080', probability: 0.5 },
            { name: 'fast', points: 20, speed: 4, color: '#F5F5F5', probability: 0.25 },
            { name: 'falling', points: 30, speed: 1.5, color: '#A9A9A9', probability: 0.15 },
            { name: 'ufo', points: 50, speed: 6, color: '#32CD32', probability: 0.1 }
        ];

        // Select type based on probability
        const rand = Math.random();
        let cumulative = 0;
        this.type = types[0];
        for (const t of types) {
            cumulative += t.probability;
            if (rand <= cumulative) {
                this.type = t;
                break;
            }
        }

        this.points = this.type.points;
        this.speed = this.type.speed;
        this.color = this.type.color;

        // Animation and size (must be BEFORE startPosition!)
        this.wingAngle = 0;
        this.wingSpeed = 0.3 + Math.random() * 0.2;
        this.size = 40 + Math.random() * 20;

        // Position and direction
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.startPosition();

        // For zigzag (fast duck)
        this.zigzagOffset = Math.random() * Math.PI * 2;

        // State
        this.isDead = false;
        this.deathY = this.y;
    }

    startPosition() {
        // Protection against incorrect sizes
        const cw = this.canvasWidth || 1920;
        const ch = this.canvasHeight || 1080;

        if (this.type.name === 'falling') {
            // Falling duck starts from top at random X position
            this.x = this.size * 2 + Math.random() * (cw - this.size * 4);
            this.y = -this.size * 2;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = this.speed;
        } else {
            // Normal ducks fly from the side
            if (this.direction === 1) {
                // Flies left to right — appears beyond left edge
                this.x = -this.size * 2;
            } else {
                // Flies right to left — appears beyond right edge
                this.x = cw + this.size * 2;
            }
            // Y position across full screen height except bottom third
            const minY = 50;
            const maxY = Math.floor(ch * 2 / 3); // Top 2/3 of screen
            this.y = minY + Math.random() * (maxY - minY);
            this.vx = this.speed * this.direction;
            this.vy = 0;
        }

        // Position validity check
        if (!isFinite(this.x) || !isFinite(this.y)) {
            this.x = this.direction === 1 ? -this.size * 2 : cw + this.size * 2;
            this.y = 150;
        }
    }

    update() {
        if (this.type.name === 'falling') {
            this.x += this.vx;
            this.y += this.vy;

            // Parachute slows down the fall
            if (this.vy < 2) {
                this.vy += 0.05;
            }

            // Limit X movement to prevent going off screen
            const margin = this.size * 2;
            if (this.x < margin) {
                this.x = margin;
                this.vx = Math.abs(this.vx) * 0.5; // Bounce right
            } else if (this.x > this.canvasWidth - margin) {
                this.x = this.canvasWidth - margin;
                this.vx = -Math.abs(this.vx) * 0.5; // Bounce left
            }
        } else if (this.type.name === 'fast') {
            // Zigzag movement
            this.x += this.vx;
            this.zigzagOffset += 0.1;
            this.y += Math.sin(this.zigzagOffset) * 3;
        } else if (this.type.name === 'ufo') {
            // UFO flies faster with slight wobble
            this.x += this.vx;
            this.y += Math.sin(Date.now() / 100) * 2;
        } else {
            // Normal duck - straight trajectory
            this.x += this.vx;
        }

        // Wing animation (2x less frequent, larger amplitude)
        this.wingAngle = Math.sin(Date.now() / 100 * this.wingSpeed * 5) * 1.2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Horizontal flip based on direction
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }

        const s = this.size / 40; // Scale

        if (this.type.name === 'ufo') {
            // Draw UFO
            this.drawUFO(ctx, s);
        } else if (this.type.name === 'falling') {
            // Draw duck with parachute
            this.drawFallingChicken(ctx, s);
        } else {
            // Draw normal duck
            this.drawChicken(ctx, s);
        }

        // Debug: dot at duck center
        ctx.fillStyle = '#FF00FF';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawChicken(ctx, s) {
        // Body (more elongated, duck-like)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, 28 * s, 15 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head (more round)
        ctx.beginPath();
        ctx.arc(22 * s, -8 * s, 11 * s, 0, Math.PI * 2);
        ctx.fill();

        // Beak (flat, duck-like)
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.ellipse(32 * s, -6 * s, 8 * s, 5 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(24 * s, -11 * s, 4 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(25 * s, -11 * s, 2 * s, 0, Math.PI * 2);
        ctx.fill();

        // Neck (slightly curved)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(15 * s, -2 * s, 8 * s, 10 * s, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Wings (animation)
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.rotate(this.wingAngle);
        ctx.beginPath();
        ctx.ellipse(-8 * s, 3 * s, 18 * s, 9 * s, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Tail (short)
        ctx.beginPath();
        ctx.ellipse(-25 * s, -2 * s, 12 * s, 7 * s, 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFallingChicken(ctx, s) {
        // Parachute (green, camouflage)
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(0, -35 * s, 25 * s, Math.PI, 0);
        ctx.fill();

        // Suspension lines
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-20 * s, -35 * s);
        ctx.lineTo(0, -10 * s);
        ctx.moveTo(20 * s, -35 * s);
        ctx.lineTo(0, -10 * s);
        ctx.stroke();

        // Duck (with green tint for camouflage)
        const originalColor = this.color;
        this.color = '#6B8E6B';
        this.drawChicken(ctx, s * 0.8);
        this.color = originalColor;
    }

    drawUFO(ctx, s) {
        // UFO body
        ctx.fillStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.ellipse(0, 5 * s, 30 * s, 10 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Dome
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.arc(0, 0, 15 * s, Math.PI, 0);
        ctx.fill();

        // Lights
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
        for (let i = 0; i < 4; i++) {
            const angle = (Date.now() / 200 + i * Math.PI / 2) % (Math.PI * 2);
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * 25 * s, 5 * s, 3 * s, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    isOffScreen() {
        const margin = 150;
        if (this.type.name === 'falling') {
            // Falling duck removed when it goes below screen
            return this.y > this.canvasHeight + margin;
        }

        // Check by flight direction
        if (this.direction === 1) {
            // Flying right — remove when past right edge
            return this.x > this.canvasWidth + margin;
        } else {
            // Flying left — remove when past left edge
            return this.x < -margin;
        }
    }

    checkHit(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size * 1.5;
    }
}
