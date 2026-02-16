class ATSService {
    constructor() {
        this.actionVerbs = [
            'developed', 'designed', 'implemented', 'led', 'improved',
            'increased', 'reduced', 'built', 'optimized', 'executed',
            'managed', 'coordinated', 'analyzed', 'created', 'maintained'
        ];
    }

    calculateScore(resumeData, jobDescription = '') {
        const breakdown = {
            wordCount: 0,
            skillsCount: 0,
            actionVerbsCount: 0,
            measurableAchievements: 0,
            keywordMatch: 0
        };

        const suggestions = [];

        // 1. Word Count (20 points)
        const fullText = this.extractAllText(resumeData);
        const wordCount = fullText.split(/\s+/).length;
        if (wordCount >= 400 && wordCount <= 800) {
            breakdown.wordCount = 20;
        } else if (wordCount > 0) {
            breakdown.wordCount = 10;
            suggestions.push(wordCount < 400 ? 'Increase your resume content to at least 400 words.' : 'Simplify your resume; it exceeds the optimal 800-word limit.');
        }

        // 2. Skills Count (20 points)
        const skillsCount = resumeData.skills ? resumeData.skills.length : 0;
        if (skillsCount >= 8) {
            breakdown.skillsCount = 20;
        } else {
            breakdown.skillsCount = (skillsCount / 8) * 20;
            suggestions.push('Add more relevant skills (at least 8) to improve your rank.');
        }

        // 3. Action Verbs (20 points)
        const verbsFound = this.actionVerbs.filter(verb => fullText.toLowerCase().includes(verb));
        if (verbsFound.length >= 5) {
            breakdown.actionVerbsCount = 20;
        } else {
            breakdown.actionVerbsCount = (verbsFound.length / 5) * 20;
            suggestions.push('Use more powerful action verbs like "Implemented", "Led", or "Optimized".');
        }

        // 4. Measurable Achievements (20 points)
        const achievementRegex = /[\d]+%|[\d]+\+|[\$][\d]+|million|billion|increased|decreased|improved|saved/gi;
        const achievements = fullText.match(achievementRegex) || [];
        if (achievements.length >= 3) {
            breakdown.measurableAchievements = 20;
        } else {
            breakdown.measurableAchievements = (achievements.length / 3) * 20;
            suggestions.push('Include measurable achievements using numbers or percentages.');
        }

        // 5. Keyword Match (20 points) - Only if jobDescription is provided
        if (jobDescription) {
            const matchData = this.calculateKeywordOverlap(fullText, jobDescription);
            breakdown.keywordMatch = (matchData.matchPercentage / 100) * 20;
            if (matchData.matchPercentage < 60) {
                suggestions.push(`Low keyword match (${matchData.matchPercentage}%). Try adding: ${matchData.missingKeywords.slice(0, 5).join(', ')}`);
            }
        } else {
            breakdown.keywordMatch = 0; // Or baseline score
        }

        const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);

        return {
            score: Math.round(totalScore),
            breakdown,
            suggestions
        };
    }

    extractAllText(data) {
        let text = `${data.wantedJobTitle || ''} ${data.professionalSummary || ''} `;
        if (data.workExperience && Array.isArray(data.workExperience)) {
            data.workExperience.forEach(exp => {
                if (exp) {
                    text += `${exp.jobTitle || ''} ${exp.companyName || ''} ${exp.description || ''} `;
                }
            });
        }
        if (data.skills) text += data.skills.join(' ');
        if (data.projects) {
            data.projects.forEach(p => {
                text += `${p.title} ${p.description} ${p.technologies ? p.technologies.join(' ') : ''} `;
            });
        }
        return text;
    }

    calculateKeywordOverlap(resumeText, jobDescription) {
        const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'for', 'with', 'on', 'at', 'by', 'an', 'be', 'this', 'that', 'from', 'it', 'was', 'as', 'are', 'i', 'my', 'we', 'our', 'you', 'your', 'his', 'her', 'their', 'its']);

        const tokenize = (text) => text.toLowerCase().match(/\b(\w+)\b/g).filter(w => !stopWords.has(w));

        const resumeTokens = new Set(tokenize(resumeText));
        const jdTokens = tokenize(jobDescription);
        const uniqueJDKeywords = Array.from(new Set(jdTokens));

        if (uniqueJDKeywords.length === 0) return { matchPercentage: 0, missingKeywords: [] };

        const matched = uniqueJDKeywords.filter(kw => resumeTokens.has(kw));
        const missing = uniqueJDKeywords.filter(kw => !resumeTokens.has(kw));

        const matchPercentage = (matched.length / uniqueJDKeywords.length) * 100;

        return {
            matchPercentage: Math.round(matchPercentage),
            missingKeywords: missing
        };
    }
}

module.exports = new ATSService();
