class EnhancerService {
    constructor() {
        this.verbMap = {
            'worked on': 'Developed',
            'helped with': 'Assisted in',
            'responsible for': 'Led',
            'did': 'Executed',
            'handled': 'Managed',
            'i was': 'Functioned as',
            'good at': 'Proficient in',
            'made': 'Created',
            'look at': 'Analyzed',
            'changed': 'Optimized',
            'fixed': 'Resolved',
            'started': 'Initiated',
            'organized': 'Structured',
            'gave': 'Presented',
            'showed': 'Demonstrated',
            'thought of': 'Devised',
            'talked to': 'Collaborated with'
        };
    }

    enhanceBullet(bullet) {
        let enhanced = bullet;

        // Simple case-insensitive replacement
        Object.keys(this.verbMap).forEach(weakVerb => {
            const regex = new RegExp(`\\b${weakVerb}\\b`, 'gi');
            enhanced = enhanced.replace(regex, (match) => {
                const strongVerb = this.verbMap[weakVerb];
                // Maintain case if possible (simple capitalize check)
                return match[0] === match[0].toUpperCase() ? strongVerb : strongVerb.toLowerCase();
            });
        });

        // Capitalize first letter of the result
        return enhanced.charAt(0).toUpperCase() + enhanced.slice(1);
    }
}

module.exports = new EnhancerService();
