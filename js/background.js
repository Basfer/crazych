/* ============================================
   BACKGROUND - Game Background
   ============================================ */
class Background {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    draw(ctx) {
        // Reset trees array before each render
        this.trees = [];

        // Sky (gradient)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        skyGradient.addColorStop(0, '#1E90FF');
        skyGradient.addColorStop(0.5, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.canvasWidth - 100, 80, 50, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(
                this.canvasWidth - 100 + Math.cos(angle) * 60,
                80 + Math.sin(angle) * 60
            );
            ctx.lineTo(
                this.canvasWidth - 100 + Math.cos(angle) * 90,
                80 + Math.sin(angle) * 90
            );
            ctx.stroke();
        }

        // Clouds
        this.drawCloud(ctx, 150, 100, 1);
        this.drawCloud(ctx, 400, 150, 0.8);
        this.drawCloud(ctx, 700, 80, 1.2);

        // Mountains
        this.drawMountains(ctx);

        // Ground
        const groundGradient = ctx.createLinearGradient(0, this.canvasHeight - 100, 0, this.canvasHeight);
        groundGradient.addColorStop(0, '#228B22');
        groundGradient.addColorStop(1, '#006400');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, this.canvasHeight - 100, this.canvasWidth, 100);

        // Trees (enlarged, 2 trees closer to center with round crown)
        this.drawTree(ctx, 150, this.canvasHeight - 120); // triangle
        this.drawTree(ctx, this.canvasWidth * 0.35, this.canvasHeight - 130, true); // round
        this.drawTree(ctx, this.canvasWidth * 0.65, this.canvasHeight - 140, true); // round
        this.drawTree(ctx, this.canvasWidth - 150, this.canvasHeight - 120); // triangle
    }

    drawCloud(ctx, x, y, scale) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.arc(x + 80 * scale, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y + 10 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMountains(ctx) {
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(0, this.canvasHeight - 100);

        // Mountain range
        const peaks = [
            { x: 100, h: 150 },
            { x: 250, h: 200 },
            { x: 400, h: 120 },
            { x: 550, h: 180 },
            { x: 700, h: 140 },
            { x: 850, h: 160 },
            { x: 1000, h: 100 }
        ];

        ctx.lineTo(0, this.canvasHeight - 100);
        for (const peak of peaks) {
            ctx.lineTo(peak.x, this.canvasHeight - 100 - peak.h);
        }
        ctx.lineTo(this.canvasWidth, this.canvasHeight - 100);
        ctx.lineTo(this.canvasWidth, this.canvasHeight);
        ctx.lineTo(0, this.canvasHeight);
        ctx.fill();

        // Snow caps
        ctx.fillStyle = '#FFF';
        for (const peak of peaks) {
            if (peak.h > 140) {
                ctx.beginPath();
                ctx.moveTo(peak.x - 30, this.canvasHeight - 100 - peak.h + 40);
                ctx.lineTo(peak.x, this.canvasHeight - 100 - peak.h);
                ctx.lineTo(peak.x + 30, this.canvasHeight - 100 - peak.h + 40);
                ctx.fill();
            }
        }
    }

    drawTree(ctx, x, y, roundCrown = false) {
        // Trunk (4x larger than original)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 40, y, 80, 160);

        if (roundCrown) {
            // Round crown
            ctx.fillStyle = '#006400';
            // Lower tier
            ctx.beginPath();
            ctx.arc(x, y - 100, 100, 0, Math.PI * 2);
            ctx.fill();
            // Middle tier
            ctx.beginPath();
            ctx.arc(x, y - 180, 85, 0, Math.PI * 2);
            ctx.fill();
            // Upper tier
            ctx.beginPath();
            ctx.arc(x, y - 250, 70, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Triangle crown (4x larger than original)
            ctx.fillStyle = '#006400';
            ctx.beginPath();
            ctx.moveTo(x - 120, y + 10);
            ctx.lineTo(x, y - 230);
            ctx.lineTo(x + 120, y + 10);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(x - 100, y - 110);
            ctx.lineTo(x, y - 310);
            ctx.lineTo(x + 100, y - 110);
            ctx.fill();
        }
    }
}
