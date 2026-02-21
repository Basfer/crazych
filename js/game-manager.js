/* ============================================
   GAME MANAGER - Game Management
   ============================================ */
class GameManager {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // UI elements
        this.scoreEl = document.getElementById('scoreValue');
        this.ammoEl = document.getElementById('ammoValue');
        this.timeEl = document.getElementById('timeValue');
        this.spawnedEl = document.getElementById('spawnedValue');
        this.hitEl = document.getElementById('hitValue');
        this.menuEl = document.getElementById('menu');
        this.gameOverEl = document.getElementById('gameOver');
        this.finalScoreEl = document.getElementById('finalScore');
        this.playerNameEl = document.getElementById('playerName');
        // Leaderboard
        this.menuHighscoreListOl = document.getElementById('menuHighscoreListOl');
        this.menuNetworkIndicator = document.getElementById('menuNetworkIndicator'); 

        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.saveScoreBtn = document.getElementById('saveScoreBtn');

        // Game settings
        this.ROUND_TIME = 90;
        this.MAX_AMMO = 7;
        this.MAX_CHICKENS = 7;

        // State
        this.state = 'MENU'; // MENU, PLAYING, GAME_OVER
        this.score = 0;
        this.ammo = 0;
        this.time = 0;
        this.spawned = 0;
        this.hit = 0;

        // Reloading state
        this.isReloading = false;

        // Game objects
        this.chickens = [];
        this.particles = [];
        this.background = null;

        // Mouse
        this.mouseX = 0;
        this.mouseY = 0;

        // Last player name
        this.lastPlayerName = localStorage.getItem('crazyChickenLastPlayerName') || '';

        // Sound
        this.soundManager = new SoundManager();

        // Database
        this.db = new DatabaseManager();

        // Language Manager
        this.languageManager = window.languageManager;

        // Highscores
        this.highscores = [];
        this.loadingScores = false;
        this.supabaseConnected = false;

        // Initialization
        this.resize();

        // Set up language change listeners
        this.initLanguage();

        this.setupEventListeners();

        // Update instructions after translations are loaded (with small delay)
        setTimeout(() => this.updateInstructions(), 100);

        // IMMEDIATELY load records from Supabase and migrate local ones
        // First load local for instant display
        this.highscores = this.loadHighscores();
        this.displayHighscores();

        // Then asynchronously load from Supabase
        this.initHighscores();

        // Start loop
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.gameTimer = 0;

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    async initHighscores() {
        console.log('Starting initHighscores...');

        // 1. Check Supabase connection
        await this.checkAndShowNetworkStatus();
        console.log('Supabase connected:', this.supabaseConnected);

        // 2. Load records from active source (Supabase or local)
        await this.loadActiveHighscores();
        console.log('Final highscores count:', this.highscores.length);

        // 3. Update UI
        this.displayHighscores();
    }

    // Check and display network status
    async checkAndShowNetworkStatus() {
        this.supabaseConnected = await this.db.checkConnection(true);
    }

    // Load records from active source
    async loadActiveHighscores() {
        console.debug('loadActiveHighscores...')
        if (this.supabaseConnected) {
            // Use only Supabase when connected
            const scores = await this.db.getHighscores(10);
            this.highscores = scores.map(s => ({
                name: s.name,
                score: s.score,
                date: new Date(s.created_at).toLocaleDateString('ru-RU')
            }));
            console.log(`Loaded ${this.highscores.length} scores from Supabase`);
        } else {
            // Use only local storage when offline
            this.highscores = this.loadHighscores();
            console.log(`Using ${this.highscores.length} local scores`);
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.background = new Background(this.canvas.width, this.canvas.height);
    }

    setupEventListeners() {
        // Resize
        window.addEventListener('resize', () => this.resize());

        // Mouse movement
        this.canvas.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.canvas ||
                document.mozPointerLockElement === this.canvas ||
                document.webkitPointerLockElement === this.canvas) {
                // Pointer lock mode - use movementX/movementY
                this.mouseX += e.movementX || e.mozMovementX || e.webkitMovementX || 0;
                this.mouseY += e.movementY || e.mozMovementY || e.webkitMovementY || 0;

                // Keep within canvas bounds
                this.mouseX = Math.max(0, Math.min(this.canvas.width, this.mouseX));
                this.mouseY = Math.max(0, Math.min(this.canvas.height, this.mouseY));
            } else {
                // Normal mode - use client coordinates
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }
        });

        // Initialize mouse position at center
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;

        // Click (shoot) - only left mouse button
        this.canvas.addEventListener('click', (e) => {
            if (this.state === 'PLAYING' && e.button === 0) {
                this.shoot();
            }
        });

        // Right click (reload) - use mousedown with button check
        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state === 'PLAYING' && e.button === 2) {
                e.preventDefault();
                e.stopPropagation();
                this.reload();
                return false;
            }
        });

        // Block middle mouse button and browser gestures
        window.addEventListener('mousedown', (e) => {
            if (this.state === 'PLAYING' && e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { capture: true });

        // Block context menu completely
        window.addEventListener('contextmenu', (e) => {
            if (this.state === 'PLAYING') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { capture: true });

        // Disable browser keyboard shortcuts during game (capture phase)
        window.addEventListener('keydown', (e) => {
            if (this.state === 'PLAYING') {
                // Exit pointer lock on ESC
                if (e.key === 'Escape') {
                    document.exitPointerLock = document.exitPointerLock ||
                                               document.mozExitPointerLock ||
                                               document.webkitExitPointerLock;
                    if (document.exitPointerLock) {
                        document.exitPointerLock();
                    }
                    return;
                }

                // Block F5, Ctrl+R, Ctrl+Shift+R, Alt+Home, etc.
                if (e.key === 'F5' ||
                    (e.ctrlKey && (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К')) ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К')) ||
                    (e.altKey && (e.key === 'Home' || e.key === 'Left' || e.key === 'Right'))) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }
        }, { capture: true });


        // Menu buttons - start game with pointer lock and fullscreen
        this.startBtn.addEventListener('click', () => {
            // Request pointer lock FIRST (must be in user gesture handler)
            const requestPointerLock = this.canvas.requestPointerLock ||
                                        this.canvas.mozRequestPointerLock ||
                                        this.canvas.webkitRequestPointerLock;
            if (requestPointerLock) {
                requestPointerLock.call(this.canvas).then(() => {
                    console.log('Pointer lock acquired');
                }).catch(err => {
                    console.log('Pointer lock failed:', err);
                });
            }

            // Request fullscreen mode
            const requestFullscreen = document.documentElement.requestFullscreen ||
                                      document.documentElement.mozRequestFullScreen ||
                                      document.documentElement.webkitRequestFullscreen ||
                                      document.documentElement.msRequestFullscreen;
            if (requestFullscreen && !document.fullscreenElement) {
                requestFullscreen.call(document.documentElement).then(() => {
                    console.log('Fullscreen entered');
                }).catch(err => {
                    console.log('Fullscreen request failed:', err);
                });
            }

            // Start the game
            this.startGame();
        });
        this.saveScoreBtn.addEventListener('click', () => this.saveHighscore());

        // Restart button - exit fullscreen and pointer lock
        this.restartBtn.addEventListener('click', () => {
            // Exit pointer lock
            document.exitPointerLock = document.exitPointerLock ||
                                       document.mozExitPointerLock ||
                                       document.webkitExitPointerLock;
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }

            // Exit fullscreen mode
            const exitFullscreen = document.exitFullscreen ||
                                   document.mozCancelFullScreen ||
                                   document.webkitExitFullscreen ||
                                   document.msExitFullscreen;
            if (exitFullscreen && document.fullscreenElement) {
                exitFullscreen.call(document).catch(err => {
                    console.log('Exit fullscreen failed:', err);
                });
            }

            this.showMenu();
        });

        // Enter to save name
    this.playerNameEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveHighscore();
            }
        });

        // Collapse/expand leaderboard and instructions
        this.setupCollapsibleSections();

        // Language selector
        this.setupLanguageSelector();
    }

    setupLanguageSelector() {
        const languageSelector = document.getElementById('languageSelector');
        const currentLanguageBtn = document.getElementById('currentLanguageBtn');

        if (!languageSelector || !currentLanguageBtn) return;

        // Toggle dropdown on button click
        currentLanguageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageSelector.classList.toggle('open');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            languageSelector.classList.remove('open');
        });
    }

    setupCollapsibleSections() {
        // Leaderboard in menu
        const menuHighscoresHeader = document.getElementById('menuHighscoresHeader');
        if (menuHighscoresHeader) {
            menuHighscoresHeader.addEventListener('click', () => {
                this.toggleSection('menuHighscoresContent', 'menuHighscoresToggle');
            });
        }

        // Instructions
        const instructionsHeader = document.getElementById('instructionsHeader');
        if (instructionsHeader) {
            instructionsHeader.addEventListener('click', () => {
                this.toggleSection('instructionsContent', 'instructionsToggle');
            });
        }
    }

    toggleSection(contentId, toggleId) {
        const content = document.getElementById(contentId);
        const toggle = document.getElementById(toggleId);

        if (content && toggle) {
            const isVisible = window.getComputedStyle(content).display !== 'none';

            if (isVisible) {
                content.style.display = 'none';
                toggle.textContent = '▲';
            } else {
                content.style.display = 'block';
                toggle.textContent = '▼';
            }
        }
    }

    // Initialize language manager (already initialized, just set up listeners)
    initLanguage() {
        if (this.languageManager) {
            // Listen for language changes
            window.addEventListener('languageChanged', () => {
                this.updateInstructions();
                // Update game over score if visible
                if (this.state === 'GAME_OVER') {
                    this.finalScoreEl.textContent = this.languageManager.t('gameOver.finalScore', { score: this.score });
                }
            });
        }
    }

    // Update instructions list with current language
    updateInstructions() {
        const instructionList = document.getElementById('instructionList');
        if (!instructionList || !this.languageManager) return;

        const items = this.languageManager.t('menu.instructionItems');
        if (items && Array.isArray(items) && items.length > 0) {
            instructionList.innerHTML = items.map(item => `<li>${item}</li>`).join('');
        }
    }

    // Manage collapsed sections state
    setMenuSectionsCollapsed(collapsed) {
        const menuContent = document.getElementById('menuHighscoresContent');
        const instructionsContent = document.getElementById('instructionsContent');
        const menuToggle = document.getElementById('menuHighscoresToggle');
        const instructionsToggle = document.getElementById('instructionsToggle');

        if (menuContent) {
            menuContent.style.display = collapsed ? 'none' : 'block';
        }
        if (instructionsContent) {
            instructionsContent.style.display = collapsed ? 'none' : 'block';
        }
        if (menuToggle) {
            menuToggle.textContent = collapsed ? '▲' : '▼';
        }
        if (instructionsToggle) {
            instructionsToggle.textContent = collapsed ? '▲' : '▼';
        }
    }

    clearLocalScores() {
        // Check Supabase connection
        if (!this.supabaseConnected) {
            alert(this.languageManager?.t('messages.warningNoConnection') || '⚠️ Save results to cloud first!');
            return;
        }

        if (confirm(this.languageManager?.t('messages.confirmClearScores') || '🗑️ Are you sure you want to clear local scores?')) {
            localStorage.removeItem('crazyChickenHighscores');
            // Load from Supabase
            this.loadActiveHighscores();
            this.displayHighscores();
            alert(this.languageManager?.t('messages.scoresCleared') || '✅ Local scores cleared!');
            console.log('Local scores cleared');
        }
    }

    startGame() {
        this.soundManager.init();

        this.state = 'PLAYING';
        this.score = 0;
        this.ammo = this.MAX_AMMO;
        this.time = this.ROUND_TIME;
        this.spawned = 0;
        this.hit = 0;
        this.chickens = [];
        this.particles = [];
        this.gameTimer = 0;
        this.spawnTimer = 0;

        // Spawn first duck for test
        setTimeout(() => this.spawnChicken(), 500);

        // Collapse sections on game start
        this.setMenuSectionsCollapsed(true);

        this.menuEl.style.display = 'none';
        this.gameOverEl.style.display = 'none';
        // Show save form and title for next Game Over
        document.getElementById('highscoreForm').style.display = 'flex';
        document.getElementById('gameOver').style.display = 'block';
        // Insert last player name
        this.playerNameEl.value = this.lastPlayerName;
        document.body.classList.remove('menu');
        document.body.classList.add('playing');

        this.updateUI();
    }

    showMenu() {
        this.state = 'MENU';
        
        // Exit pointer lock to show mouse cursor
        document.exitPointerLock = document.exitPointerLock ||
                                   document.mozExitPointerLock ||
                                   document.webkitExitPointerLock;
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }

        // // Exit fullscreen mode
        // const exitFullscreen = document.exitFullscreen ||
        //                        document.mozCancelFullScreen ||
        //                        document.webkitExitFullscreen ||
        //                        document.msExitFullscreen;
        // if (exitFullscreen && document.fullscreenElement) {
        //     exitFullscreen.call(document).catch(err => {
        //         console.log('Exit fullscreen failed:', err);
        //     });
        // }
        
        this.menuEl.style.display = 'flex';
        this.gameOverEl.style.display = 'none';
        // Expand leaderboard, collapse instructions
        this.setMenuSectionsCollapsed(false);
        const instructionsContent = document.getElementById('instructionsContent');
        const instructionsToggle = document.getElementById('instructionsToggle');
        if (instructionsContent) instructionsContent.style.display = 'none';
        if (instructionsToggle) instructionsToggle.textContent = '▲';
        document.body.classList.remove('playing');
        document.body.classList.add('menu');
    }

    async gameOver() {
        console.debug('gameOver...')
        this.state = 'GAME_OVER';
        this.soundManager.playGameOver();

        this.finalScoreEl.textContent = this.languageManager?.t('gameOver.finalScore', { score: this.score }) || `Score: ${this.score}`;
        
        // Exit pointer lock to show mouse cursor in menu
        document.exitPointerLock = document.exitPointerLock ||
                                   document.mozExitPointerLock ||
                                   document.webkitExitPointerLock;
        if (document.exitPointerLock) {
            document.exitPointerLock();
        }
        
        this.showMenu();
        this.gameOverEl.style.display = 'contents';
        document.body.classList.remove('playing');
        document.body.classList.add('menu');

        // Check network and update table
        await this.checkAndShowNetworkStatus();
        await this.loadActiveHighscores();
        this.displayHighscores();
    }

    shoot() {
        // Can't shoot while reloading or out of ammo
        if (this.isReloading || this.ammo <= 0) return;

        this.ammo--;
        this.soundManager.playShoot();

        // Check tree hit (obstacle)
        let hitTree = false;
        const ch = this.canvas.height;
        const trees = [
            { x: 150, y: ch - 120, type: 'triangle' },
            { x: this.canvas.width * 0.35, y: ch - 130, type: 'round' },
            { x: this.canvas.width * 0.65, y: ch - 140, type: 'round' },
            { x: this.canvas.width - 150, y: ch - 120, type: 'triangle' }
        ];

        for (const tree of trees) {
            if (this.checkTreeHit(tree)) {
                hitTree = true;
                break;
            }
        }

        if (hitTree) {
            // Hit tree - miss with funny sound
            this.soundManager.playMiss();
            this.updateUI();

            return;
        }

        // Check duck hits
        let isHit = false;
        for (let i = this.chickens.length - 1; i >= 0; i--) {
            const chicken = this.chickens[i];
            if (chicken.checkHit(this.mouseX, this.mouseY)) {
                // Hit!
                this.score += chicken.points;
                this.hit++;
                this.soundManager.playHit();
                this.createParticles(chicken.x, chicken.y, chicken.color);
                this.chickens.splice(i, 1);
                isHit = true;
                break;
            }
        }

        if (!isHit) {
            this.soundManager.playMiss();
        }

        this.updateUI();
    }

    // Reload weapon (right click)
    reload() {
        // Can't reload if already reloading or ammo is full
        if (this.isReloading || this.ammo >= this.MAX_AMMO) return;

        this.isReloading = true;
        this.soundManager.playReload();

        // Reload completes after 1 second (sound duration)
        setTimeout(() => {
            this.ammo = this.MAX_AMMO;
            this.isReloading = false;
            this.updateUI();
            console.log('Reloaded! Ammo:', this.ammo);
        }, 1000);
    }

    // Check tree hit considering crown shape
    checkTreeHit(tree) {
        const trunkWidth = 80;
        const trunkHeight = 160;
        const trunkTop = tree.y;
        const trunkBottom = tree.y + trunkHeight;

        // Check trunk hit
        if (this.mouseX >= tree.x - trunkWidth / 2 &&
            this.mouseX <= tree.x + trunkWidth / 2 &&
            this.mouseY >= trunkTop &&
            this.mouseY <= trunkBottom) {
            return true;
        }

        // Check crown hit
        if (tree.type === 'round') {
            // Round crown - three tiers
            const crownLayers = [
                { y: tree.y - 90, r: 100 },   // Lower tier (lowered by 10px)
                { y: tree.y - 170, r: 85 },    // Middle tier (lowered by 10px)
                { y: tree.y - 240, r: 70 }     // Upper tier (lowered by 10px)
            ];

            for (const layer of crownLayers) {
                const dx = this.mouseX - tree.x;
                const dy = this.mouseY - layer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= layer.r) {
                    return true;
                }
            }
        } else {
            // Triangular crown - two triangles (lowered by 10px)
            const triangles = [
                { baseY: tree.y + 10, topY: tree.y - 230, halfWidth: 120 },
                { baseY: tree.y - 120, topY: tree.y - 320, halfWidth: 100 }
            ];

            for (const tri of triangles) {
                // Check triangle hit
                if (this.mouseY >= tri.topY && this.mouseY <= tri.baseY) {
                    // Triangle width at click level (linear interpolation from vertex to base)
                    const triHeight = tri.baseY - tri.topY;
                    const progress = (this.mouseY - tri.topY) / triHeight;
                    const currentHalfWidth = tri.halfWidth * progress;

                    if (this.mouseX >= tree.x - currentHalfWidth &&
                        this.mouseX <= tree.x + currentHalfWidth) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 15; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    spawnChicken() {
        if (this.chickens.length >= this.MAX_CHICKENS) return;

        // Make sure sizes are correct
        let width = this.canvas.width;
        let height = this.canvas.height;

        if (!width || !height) {
            width = window.innerWidth;
            height = window.innerHeight;
        }

        this.chickens.push(new Chicken(width, height));
        this.spawned++;
        this.soundManager.playSpawn();
        this.updateUI();
    }

    update(deltaTime) {
        if (this.state !== 'PLAYING') return;

        // Game timer
        this.gameTimer += deltaTime;
        if (this.gameTimer >= 1000) {
            this.gameTimer -= 1000;
            this.time--;
            this.updateUI();

            if (this.time <= 0) {
                this.gameOver();
                return;
            }
        }

        // Duck spawn
        this.spawnTimer += deltaTime;
        const spawnInterval = Math.max(800, 2000 - this.score * 5); // More points = more frequent spawn (minimum 800ms)
        if (this.spawnTimer >= spawnInterval) {
            this.spawnTimer = 0;
            this.spawnChicken();
        }

        // Update ducks
        for (let i = this.chickens.length - 1; i >= 0; i--) {
            this.chickens[i].update();
            if (this.chickens[i].isOffScreen()) {
                this.chickens.splice(i, 1);
            }
        }

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Background (without trees)
        if (this.background) {
            this.drawBackgroundWithoutTrees();
        }

        // Ducks
        for (const chicken of this.chickens) {
            chicken.draw(this.ctx);
        }

        // Trees (over ducks)
        if (this.background) {
            this.drawTrees();
        }

        // Particles
        for (const particle of this.particles) {
            particle.draw(this.ctx);
        }

        // Crosshair
        if (this.state === 'PLAYING') {
            this.drawCrosshair();
        }
    }

    drawBackgroundWithoutTrees() {
        const ctx = this.ctx;
        const cw = this.canvas.width;
        const ch = this.canvas.height;

        // Sky (gradient)
        const skyGradient = ctx.createLinearGradient(0, 0, 0, ch);
        skyGradient.addColorStop(0, '#1E90FF');
        skyGradient.addColorStop(0.5, '#87CEEB');
        skyGradient.addColorStop(1, '#E0F6FF');
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, cw, ch);

        // Sun
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(cw - 100, 80, 50, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(
                cw - 100 + Math.cos(angle) * 60,
                80 + Math.sin(angle) * 60
            );
            ctx.lineTo(
                cw - 100 + Math.cos(angle) * 90,
                80 + Math.sin(angle) * 90
            );
            ctx.stroke();
        }

        // Clouds
        this.drawCloud(150, 100, 1);
        this.drawCloud(400, 150, 0.8);
        this.drawCloud(700, 80, 1.2);

        // Mountains
        this.drawMountains();

        // Ground
        const groundGradient = ctx.createLinearGradient(0, ch - 100, 0, ch);
        groundGradient.addColorStop(0, '#228B22');
        groundGradient.addColorStop(1, '#006400');
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, ch - 100, cw, 100);
    }

    drawCloud(x, y, scale) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y - 10 * scale, 35 * scale, 0, Math.PI * 2);
        ctx.arc(x + 80 * scale, y, 30 * scale, 0, Math.PI * 2);
        ctx.arc(x + 40 * scale, y + 10 * scale, 25 * scale, 0, Math.PI * 2);
        ctx.fill();
    }

    drawMountains() {
        const ctx = this.ctx;
        const ch = this.canvas.height;

        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(0, ch - 100);

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

        ctx.lineTo(0, ch - 100);
        for (const peak of peaks) {
            ctx.lineTo(peak.x, ch - 100 - peak.h);
        }
        ctx.lineTo(this.canvas.width, ch - 100);
        ctx.lineTo(this.canvas.width, ch);
        ctx.lineTo(0, ch);
        ctx.fill();

        // Snow caps
        ctx.fillStyle = '#FFF';
        for (const peak of peaks) {
            if (peak.h > 140) {
                ctx.beginPath();
                ctx.moveTo(peak.x - 30, ch - 100 - peak.h + 40);
                ctx.lineTo(peak.x, ch - 100 - peak.h);
                ctx.lineTo(peak.x + 30, ch - 100 - peak.h + 40);
                ctx.fill();
            }
        }
    }

    drawTrees() {
        const ctx = this.ctx;
        const ch = this.canvas.height;

        // Draw trees in same order as in background.draw()
        this._drawTree(150, ch - 120); // triangle
        this._drawTree(this.canvas.width * 0.35, ch - 130, true); // round
        this._drawTree(this.canvas.width * 0.65, ch - 140, true); // round
        this._drawTree(this.canvas.width - 150, ch - 120); // triangle
    }

    _drawTree(x, y, roundCrown = false) {
        const ctx = this.ctx;

        // Trunk (4x larger than original)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x - 40, y, 80, 160);

        if (roundCrown) {
            // Round crown (lowered by 10 pixels)
            ctx.fillStyle = '#006400';
            // Lower tier
            ctx.beginPath();
            ctx.arc(x, y - 90, 100, 0, Math.PI * 2);
            ctx.fill();
            // Middle tier
            ctx.beginPath();
            ctx.arc(x, y - 170, 85, 0, Math.PI * 2);
            ctx.fill();
            // Upper tier
            ctx.beginPath();
            ctx.arc(x, y - 240, 70, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Triangular crown (4x larger than original, lowered by 10 pixels)
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

    drawCrosshair() {
        const x = this.mouseX;
        const y = this.mouseY;
        const size = 20;

        this.ctx.save();
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = '#000';
        this.ctx.shadowBlur = 4;

        // Outer circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.stroke();

        // Cross
        this.ctx.beginPath();
        this.ctx.moveTo(x - size - 5, y);
        this.ctx.lineTo(x + size + 5, y);
        this.ctx.moveTo(x, y - size - 5);
        this.ctx.lineTo(x, y + size + 5);
        this.ctx.stroke();

        // Center dot
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    updateUI() {
        this.scoreEl.textContent = this.score;
        this.ammoEl.textContent = this.ammo;
        this.timeEl.textContent = this.time;
        this.spawnedEl.textContent = this.spawned;
        this.hitEl.textContent = this.hit;

        // Show/hide reload indicator
        const reloadIndicator = document.getElementById('reloadIndicator');
        if (reloadIndicator) {
            reloadIndicator.style.display = this.isReloading ? 'block' : 'none';
        }
    }

    saveHighscore() {
        console.debug('saveHighscore...')
        const name = this.playerNameEl.value.trim() || 'Anonymous';
        this.lastPlayerName = name;

        if (this.supabaseConnected) {
            // Save only to Supabase when connected
            this.db.saveScore(name, this.score).then(() => {
                // Reload and display leaderboard after save
                this.loadActiveHighscores().then(() => {
                    this.displayHighscores();
                });
            });
        } else {
            // Save only to local storage when offline
            localStorage.setItem('crazyChickenLastPlayerName', name);
            const localScores = this.loadHighscores();
            localScores.push({ name, score: this.score, date: new Date().toLocaleDateString('ru-RU') });
            localScores.sort((a, b) => b.score - a.score);
            localScores.splice(10); // Keep only top 10
            localStorage.setItem('crazyChickenHighscores', JSON.stringify(localScores));
        }

        // Hide save form and show Game Over title
        document.getElementById('highscoreForm').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';

        // Reload and display leaderboard
        this.loadActiveHighscores();
        this.displayHighscores();
    }

    loadHighscores() {
        try {
            const data = localStorage.getItem('crazyChickenHighscores');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading highscores:', e);
            return [];
        }
    }

    displayHighscores() {
        const displayList = (olElement, networkIndicator) => {
            if (!olElement) return;

            olElement.innerHTML = '';

            if (this.highscores.length === 0) {
                olElement.innerHTML = '<li>Нет записей</li>';
                return;
            }

            this.highscores.forEach((hs, index) => {
                const li = document.createElement('li');

                // Medal for top 3
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

                li.innerHTML = `<strong>${hs.name}</strong> — ${hs.score} <span style="font-size: 12px; color: #888;">(${hs.date})</span>`;
                li.textContent = `${medal} ${hs.name} — ${hs.score}`;
                olElement.appendChild(li);
            });

            // Update network indicator
            if (networkIndicator) {
                networkIndicator.textContent = this.supabaseConnected ? '🟢' : '🔴';
                networkIndicator.title = this.supabaseConnected ? 'DB online' : 'DB offline';
            }
        };

        displayList(this.menuHighscoreListOl, this.menuNetworkIndicator);
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.gameLoop(t));
    }
}
