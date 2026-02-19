/* ============================================
   LANGUAGE MANAGER - Localization System
   ============================================ */
console.log('language-manager.js loaded');

class LanguageManager {
    constructor() {
        this.currentLanguage = 'ru';
        this.supportedLanguages = ['ru', 'ua', 'en', 'de', 'es', 'ja', 'zh', 'hi'];
        this.translations = {};
        this.loadedLanguages = new Set();
        this.STORAGE_KEY = 'crazyDuckLanguage';
    }

    // Initialize language manager
    async init() {
        // Load saved language or detect default
        const savedLang = this.getSavedLanguage();
        const detectedLang = this.detectDefaultLanguage();
        this.currentLanguage = savedLang || detectedLang;

        // Load current language translations
        const loaded = await this.loadLanguage(this.currentLanguage);

        // Apply translations to UI
        this.applyTranslations();
    }

    // Get saved language from localStorage
    getSavedLanguage() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }
        return null;
    }

    // Detect default language from browser
    detectDefaultLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        // Check if browser language is supported
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        // Default to Russian
        return 'ru';
    }

    // Load language file
    async loadLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            console.warn(`Language ${langCode} is not supported`);
            return false;
        }

        if (this.loadedLanguages.has(langCode)) {
            return true;
        }

        try {
            const response = await fetch(`locales/${langCode}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${langCode}`);
            }
            
            this.translations[langCode] = await response.json();
            this.loadedLanguages.add(langCode);
            console.log(`Language loaded: ${langCode}`);
            return true;
        } catch (error) {
            console.error(`Error loading language ${langCode}:`, error);
            return false;
        }
    }

    // Get translation by key path (e.g., "menu.title")
    t(keyPath, params = {}) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLanguage];

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation not found: ${keyPath}`);
                return keyPath;
            }
        }

        // Replace parameters {paramName}
        if (typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
            });
        }

        return value;
    }

    // Get flag emoji for language
    getFlag(langCode) {
        const flags = {
            'ru': '🇷🇺',
            'ua': '🇺🇦',
            'en': '🇬🇧',
            'de': '🇩🇪',
            'es': '🇪🇸',
            'ja': '🇯🇵',
            'zh': '🇨🇳',
            'hi': '🇮🇳'
        };
        return flags[langCode] || '🌐';
    }

    // Get language name in native language
    getLanguageName(langCode) {
        const names = {
            'ru': 'Русский',
            'ua': 'Українська',
            'en': 'English',
            'de': 'Deutsch',
            'es': 'Español',
            'ja': '日本語',
            'zh': '中文',
            'hi': 'हिन्दी'
        };
        return names[langCode] || langCode;
    }

    // Change current language
    async setLanguage(langCode) {
        if (!this.supportedLanguages.includes(langCode)) {
            console.warn(`Language ${langCode} is not supported`);
            return false;
        }

        if (this.currentLanguage === langCode) {
            return true;
        }

        // Load language if not loaded
        const loaded = await this.loadLanguage(langCode);
        if (!loaded) {
            return false;
        }

        // Update current language
        this.currentLanguage = langCode;
        
        // Save to localStorage
        localStorage.setItem(this.STORAGE_KEY, langCode);
        
        // Apply translations to UI
        this.applyTranslations();
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: langCode } }));
        
        console.log(`Language changed to: ${langCode}`);
        return true;
    }

    // Apply translations to all elements with data-i18n attribute
    applyTranslations() {
        console.log('applyTranslations called');
        
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.value = translation;
                }
            } else {
                element.innerHTML = translation;
            }
        });

        // Update document title
        document.title = this.t('title');

        // Update language selector if exists
        this.updateLanguageSelector();
    }

    // Update language selector UI
    updateLanguageSelector() {
        console.log('updateLanguageSelector called');
        
        const selector = document.getElementById('languageSelector');
        console.log('selector element:', selector);
        
        if (!selector) {
            console.warn('languageSelector not found in DOM');
            return;
        }

        // Update current language display
        const currentFlag = document.getElementById('currentFlag');
        const currentName = document.getElementById('currentName');
        
        console.log('currentFlag:', currentFlag, 'currentName:', currentName);

        if (currentFlag) {
            currentFlag.textContent = this.getFlag(this.currentLanguage);
        }
        if (currentName) {
            currentName.textContent = this.getLanguageName(this.currentLanguage);
        }

        // Update language options
        const optionsList = document.getElementById('languageOptions');
        if (optionsList) {
            optionsList.innerHTML = '';
            console.log('Creating language options...');

            this.supportedLanguages.forEach(langCode => {
                const option = document.createElement('div');
                option.className = 'language-option';
                option.dataset.lang = langCode;

                if (langCode === this.currentLanguage) {
                    option.classList.add('active');
                }

                option.innerHTML = `
                    <span class="lang-flag">${this.getFlag(langCode)}</span>
                    <span class="lang-name">${this.getLanguageName(langCode)}</span>
                `;

                option.addEventListener('click', () => {
                    this.setLanguage(langCode);
                });

                optionsList.appendChild(option);
            });
            
            console.log('Language options created:', optionsList.children.length);
        } else {
            console.warn('languageOptions element not found');
        }
    }

    // Get all supported languages with names and flags
    getSupportedLanguages() {
        return this.supportedLanguages.map(code => ({
            code,
            name: this.getLanguageName(code),
            flag: this.getFlag(code)
        }));
    }
}

// Create global instance
const languageManager = new LanguageManager();
window.languageManager = languageManager;
console.log('languageManager created and assigned to window:', window.languageManager);
