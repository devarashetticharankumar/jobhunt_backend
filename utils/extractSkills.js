const techKeywords = [
    "React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "SQL", "Redis",
    "HTML", "CSS", "Tailwind", "Next.js", "Vue", "Angular", "Express", "Django", "Flask",
    "PHP", "Laravel", "Ruby", "Rails", "Android", "iOS", "Swift", "Flutter", "React Native",
    "DevOps", "CI/CD", "Testing", "QA", "Security", "Machine Learning", "AI", "Data Science"
];

function extractSkills(text) {
    if (!text) return [];

    const extracted = new Set();
    const lowerText = text.toLowerCase();

    techKeywords.forEach(skill => {
        // Exact word match using word boundaries
        const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        if (regex.test(lowerText)) {
            extracted.add(skill);
        }
    });

    return Array.from(extracted);
}

module.exports = extractSkills;
