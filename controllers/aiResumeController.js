const { ObjectId } = require('mongodb');
const summaryService = require('../services/summaryService');
const atsService = require('../services/atsService');
const enhancerService = require('../services/enhancerService');

const generateSummary = async (req, res) => {
    try {
        const resumeData = req.body;
        const summary = summaryService.generateSummary(resumeData);
        res.status(200).json({ success: true, summary });
    } catch (error) {
        console.error('Error in generateSummary:', error);
        res.status(500).json({ success: false, message: 'Failed to generate summary: ' + error.message });
    }
};

const getATSScore = async (req, res) => {
    const db = req.app.locals.db;
    const resumesCollection = db.collection('resumes');

    try {
        const { resumeId, jobDescription } = req.body;

        if (!ObjectId.isValid(resumeId)) {
            return res.status(400).json({ message: 'Invalid resume ID' });
        }

        const resume = await resumesCollection.findOne({ _id: new ObjectId(resumeId) });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const analysis = atsService.calculateScore(resume, jobDescription);

        // Update resume with analysis results
        await resumesCollection.updateOne(
            { _id: new ObjectId(resumeId) },
            {
                $set: {
                    atsScore: analysis.score,
                    atsBreakdown: analysis.breakdown,
                    lastAnalyzedAt: new Date()
                }
            }
        );

        res.status(200).json({ success: true, ...analysis });
    } catch (error) {
        console.error('Error in getATSScore:', error);
        res.status(500).json({ success: false, message: 'Failed to calculate ATS score: ' + error.message });
    }
};

const enhanceBullet = async (req, res) => {
    console.log('--- Enhance Bullet Request ---');
    console.log('Body:', req.body);
    try {
        const { bullet } = req.body;
        if (!bullet) return res.status(400).json({ message: 'Bullet text is required' });

        const enhancedBullet = enhancerService.enhanceBullet(bullet);
        res.status(200).json({ success: true, enhancedBullet });
    } catch (error) {
        console.error('Error in enhanceBullet:', error);
        res.status(500).json({ success: false, message: 'Failed to enhance bullet: ' + error.message });
    }
};

module.exports = {
    generateSummary,
    getATSScore,
    enhanceBullet
};
