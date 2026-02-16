const express = require('express');
const router = express.Router();
const aiResumeController = require('../controllers/aiResumeController');
const checkJwt = require('../middleware/checkJwt');

// Middleware to ensure authentication
const ensureAuthenticated = [
    checkJwt,
    (req, res, next) => {
        if (req.auth) {
            req.user = req.auth;
        }
        if (!req.user) {
            return res.status(401).send({ message: "Unauthorized: Please log in" });
        }
        next();
    }
];

router.post('/generate-summary', ensureAuthenticated, aiResumeController.generateSummary);
router.post('/ats-score', ensureAuthenticated, aiResumeController.getATSScore);
router.post('/enhance-bullet', ensureAuthenticated, aiResumeController.enhanceBullet);

module.exports = router;
