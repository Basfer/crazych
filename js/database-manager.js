/* ============================================
   DATABASE MANAGER - Supabase Integration
   ============================================ */
class DatabaseManager {
    constructor() {
        // WARNING: This data is visible in browser, but RLS protects the database
        this.supabaseUrl = 'https://qpbmtblatvtvwdpgbenn.supabase.co';
        this.supabaseKey = 'sb_publishable_DYO3jI1gGsGOauDctyDH4g_I3lgVoFO'; // Anonymous key (write-only)
        this.supabase = null;
        this.initialized = false;
        this.migrationDone = false;
        this.lastCheckTime = 0;
        this.cacheAvailable = false;

        // Check if Supabase is loaded
        if (typeof supabase !== 'undefined') {
            try {
                this.supabase = supabase.createClient(this.supabaseUrl, this.supabaseKey);
                this.initialized = true;
                console.log('Supabase client created');
            } catch (e) {
                console.warn('Supabase not available:', e);
            }
        }
    }

    // Check Supabase availability (with result caching)
    async checkConnection(force = false) {
        if (!this.initialized) {
            this.cacheAvailable = false;
            console.log('Supabase check: not initialized');
            return false;
        }

        // Cache result for 5 seconds
        const now = Date.now();
        if (!force && now - this.lastCheckTime < 5000) {
            return this.cacheAvailable;
        }

        try {
            console.log('Checking Supabase connection...');
            const { data, error } = await this.supabase
                .from('highscores')
                .select('id')
                .limit(1);

            if (error) {
                console.error('Supabase connection error:', error.message);
            } else {
                console.log('Supabase connection successful');
            }

            this.cacheAvailable = !error;
            this.lastCheckTime = now;
            return this.cacheAvailable;
        } catch (e) {
            console.error('Supabase connection failed:', e.message);
            this.cacheAvailable = false;
            this.lastCheckTime = now;
            return false;
        }
    }

    // Save result
    async saveScore(name, score) {
        if (!this.initialized) {
            return false;
        }

        try {
            const { data, error } = await this.supabase
                .from('highscores')
                .insert([{ name, score }]);

            if (error) {
                console.error('Error saving score:', error);
                return false;
            }

            console.log('Score saved successfully:', data);
            return true;
        } catch (e) {
            console.error('Network error:', e);
            return false;
        }
    }

    // Get top players
    async getHighscores(limit = 10) {
        if (!this.initialized) {
            return [];
        }

        try {
            const { data, error } = await this.supabase
                .from('highscores')
                .select('*')
                .order('score', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching scores:', error);
                return [];
            }

            return data || [];
        } catch (e) {
            console.error('Network error:', e);
            return [];
        }
    }

    // Migrate local records to Supabase
    async migrateLocalScores(localScores) {
        if (!this.initialized || this.migrationDone || localScores.length === 0) {
            return { migrated: 0, total: localScores.length };
        }

        this.migrationDone = true;
        let migrated = 0;

        try {
            // Check if these results already exist in the database
            const { data: existingScores } = await this.getHighscores(100);
            const existingSet = new Set();
            
            if (existingScores && existingScores.length > 0) {
                existingScores.forEach(s => {
                    existingSet.add(`${s.name}-${s.score}`);
                });
            }

            // Save only those that don't exist yet
            for (const score of localScores) {
                const key = `${score.name}-${score.score}`;
                if (!existingSet.has(key)) {
                    const saved = await this.saveScore(score.name, score.score);
                    if (saved) migrated++;
                    // Small delay between requests
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            console.log(`Migration complete: ${migrated}/${localScores.length} scores migrated`);
        } catch (e) {
            console.error('Migration error:', e);
        }

        return { migrated, total: localScores.length };
    }
}
