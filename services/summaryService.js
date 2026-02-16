const fs = require('fs');
const path = require('path');

class SummaryService {
    constructor() {
        this.templates = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/summaryTemplates.json'), 'utf8'));
    }

    calculateExperience(workExperience) {
        if (!workExperience || workExperience.length === 0) return 0;

        let totalMonths = 0;
        workExperience.forEach(exp => {
            if (exp && exp.startDate) {
                const start = new Date(exp.startDate);
                const end = exp.endDate ? new Date(exp.endDate) : new Date();

                if (!isNaN(start.getTime())) {
                    const diffTime = Math.abs(end - start);
                    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
                    totalMonths += diffMonths;
                }
            }
        });

        return Math.floor(totalMonths / 12);
    }

    generateSummary(resumeData) {
        const { wantedJobTitle, workExperience, skills } = resumeData;
        const years = this.calculateExperience(workExperience);
        const topSkills = skills && skills.length > 0 ? skills.slice(0, 3).join(', ') : 'key industry skills';
        const role = wantedJobTitle || 'Professional';

        let templateKey = 'generic';
        const normalizedRole = role.toLowerCase();

        if (normalizedRole.includes('software engineer')) templateKey = 'software_engineer';
        else if (normalizedRole.includes('frontend')) templateKey = 'frontend_developer';
        else if (normalizedRole.includes('backend')) templateKey = 'backend_developer';
        else if (normalizedRole.includes('full stack') || normalizedRole.includes('fullstack')) templateKey = 'fullstack_developer';
        else if (normalizedRole.includes('data analyst')) templateKey = 'data_analyst';
        else if (normalizedRole.includes('project manager')) templateKey = 'project_manager';

        const template = this.templates[templateKey];

        return template
            .replace('{years}', years)
            .replace('{topSkills}', topSkills)
            .replace('{role}', role);
    }
}

module.exports = new SummaryService();
